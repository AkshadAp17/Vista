import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Bike, Phone, User } from "lucide-react";

interface Message {
  _id: string;
  id?: number;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

interface ChatRoom {
  id: string;
  vehicleId: string;
  buyerId: string;
  sellerId: string;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    vehicleNumber: string;
    price: number;
  };
  buyer: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  messages: Message[];
}

interface VehicleChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    vehicleNumber: string;
    location: string;
    kmDriven: number;
    condition: string;
    isFeatured: boolean;
    isActive: boolean;
    fuelType: string;
    sellerId: string;
    seller: {
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
    };
  };
}

export default function VehicleChatDialog({ open, onOpenChange, vehicle }: VehicleChatDialogProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRoomIdRef = useRef<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const processedMessageIds = useRef<Set<string>>(new Set());

  // Get or create chat room
  const createChatRoomMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chat-rooms", {
        vehicleId: vehicle.id,
      });
      return response;
    },
    onSuccess: (data: any) => {
      console.log("Chat room loaded:", data);
      console.log("Messages in chat room:", data.messages?.length || 0);
      setChatRoom(data);
      chatRoomIdRef.current = data.id;
      
      // Scroll to bottom after loading messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error) => {
      console.error("Error creating chat room:", error);
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!chatRoom) return;
      
      const response = await apiRequest("POST", `/api/chat-rooms/${chatRoom.id}/messages`, {
        content,
      });
      return response;
    },
    onSuccess: (newMessage: any) => {
      if (chatRoom && newMessage) {
        // Ensure proper message structure with sender data
        const safeMessage = {
          ...newMessage,
          sender: {
            id: newMessage.sender?.id || (user as any)?.id || "",
            firstName: newMessage.sender?.firstName || (user as any)?.firstName || "",
            lastName: newMessage.sender?.lastName || (user as any)?.lastName || "",
            profileImageUrl: newMessage.sender?.profileImageUrl || (user as any)?.profileImageUrl || "",
          }
        };
        
        // Add message to processed set to prevent duplicates
        processedMessageIds.current.add(safeMessage._id);
        
        setChatRoom(prev => prev ? {
          ...prev,
          messages: [...prev.messages, safeMessage]
        } : null);
      }
      setNewMessage("");
      
      // Scroll to bottom immediately after sending a message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      
      // Invalidate chat rooms query to update the notification badge
      queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Initialize chat room when dialog opens
  useEffect(() => {
    if (open && isAuthenticated && user) {
      // Check if user is trying to chat with themselves (they are the seller)  
      if ((user as any).isAdmin || (user as any).id === vehicle.sellerId) {
        toast({
          title: "Cannot Start Chat",
          description: "You cannot start a chat with yourself. This is your own vehicle listing.",
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }
      createChatRoomMutation.mutate();
    }
  }, [open, isAuthenticated, user]);

  // Debug effect to log chat room state
  useEffect(() => {
    if (chatRoom) {
      console.log("Chat room state updated:", chatRoom);
      console.log("Number of messages:", chatRoom.messages?.length || 0);
      
      // Update the ref with the current chat room ID
      chatRoomIdRef.current = chatRoom.id;
      
      // Scroll to bottom when messages change
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatRoom]);

  // Setup WebSocket connection - only when user or authentication changes
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Close any existing socket
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      socketRef.current.close();
      socketRef.current = null;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    // Determine WebSocket URL properly for production and development
    const hostname = window.location.hostname || 'localhost';
    const port = window.location.port || (protocol === "wss:" ? "443" : "5000");
    
    // Construct the WebSocket URL
    let wsUrl;
    if (hostname.includes('replit.dev') || hostname.includes('vercel.app') || hostname.includes('herokuapp.com')) {
      // For production environments, use the current host
      wsUrl = `${protocol}//${window.location.host}/ws`;
    } else {
      // For local development, explicitly specify the port
      wsUrl = `${protocol}//${hostname}:${port}/ws`;
    }
    
    console.log("WebSocket URL:", wsUrl);
    
    console.log("Attempting WebSocket connection to:", wsUrl);
    
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({
        type: "authenticate",
        userId: (user as any)?.id,
      }));
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "new_message" && chatRoomIdRef.current && data.chatRoomId === chatRoomIdRef.current) {
        console.log("Received new message via WebSocket:", data.message);
        
        // Check if we've already processed this message
        if (processedMessageIds.current.has(data.message._id)) {
          console.log("Skipping duplicate message:", data.message._id);
          return;
        }
        
        // Add to processed set
        processedMessageIds.current.add(data.message._id);
        
        // Ensure proper message structure with sender data
        const safeMessage = {
          ...data.message,
          sender: {
            id: data.message.sender?.id || "",
            firstName: data.message.sender?.firstName || "",
            lastName: data.message.sender?.lastName || "",
            profileImageUrl: data.message.sender?.profileImageUrl || "",
          }
        };
        
        setChatRoom(prev => {
          if (!prev) return null;
          
          // Double check if message already exists to prevent duplicates
          const messageExists = prev.messages.some(m => m._id === safeMessage._id);
          if (messageExists) {
            return prev;
          }
          
          const updatedRoom = {
            ...prev,
            messages: [...prev.messages, safeMessage]
          };
          
          // Scroll to bottom after adding a new message
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 50);
          
          return updatedRoom;
        });
        
        // Invalidate chat rooms query to update the notification badge
        queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setSocket(null);
    };

    return () => {
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close();
      }
    };
  }, [isAuthenticated, user]); // Only depend on auth status and user, not chatRoom

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatRoom) return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherUser = (chat: ChatRoom) => {
    if (!user) return null;
    return chat.buyerId === (user as any).id ? chat.seller : chat.buyer;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bike className="h-5 w-5 text-orange-500" />
            Chat about {vehicle.brand} {vehicle.model}
          </DialogTitle>
        </DialogHeader>

        {/* Vehicle Info */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
          <div className="flex-1">
            <h3 className="font-semibold">{vehicle.brand} {vehicle.model}</h3>
            <p className="text-sm text-gray-600">
              {vehicle.year} • {vehicle.kmDriven.toLocaleString()} km • {vehicle.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-orange-600">₹{(vehicle.price || 0).toLocaleString()}</p>
            <p className="text-sm text-gray-600">{vehicle.vehicleNumber || `VH${String((vehicle.id || '').slice(-3)).padStart(3, '0')}`}</p>
          </div>
        </div>

        {/* Loading State */}
        {createChatRoomMutation.isPending && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Starting chat...</p>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {chatRoom && (
          <>
            <ScrollArea className="flex-1 p-4 border rounded-lg">
              {!chatRoom.messages || chatRoom.messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatRoom.messages?.map((message) => {
                    const isOwnMessage = message.senderId === (user as any)?.id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start gap-2 max-w-xs ${
                            isOwnMessage ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender?.profileImageUrl || ""} 
                              alt={`${message.sender?.firstName || ""} ${message.sender?.lastName || ""}`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }} 
                            />
                            <AvatarFallback>
                              {message.sender?.firstName?.[0] || ""}
                              {message.sender?.lastName?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg px-3 py-2 ${
                              isOwnMessage
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwnMessage ? "text-white/75" : "text-gray-500"
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sendMessageMutation.isPending}
                className="focus-visible:ring-orange-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendMessageMutation.isPending}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}