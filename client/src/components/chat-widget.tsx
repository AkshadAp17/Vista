import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2,
  Car,
  Phone,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

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

export default function ChatWidget() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat rooms
  const { data: chatRooms = [], isLoading: chatsLoading } = useQuery<ChatRoom[]>({
    queryKey: ["/api/chat-rooms"],
    enabled: isAuthenticated && isOpen,
  });

  // Check for selected chat ID from localStorage when opening
  useEffect(() => {
    if (isOpen && chatRooms.length > 0) {
      const selectedChatId = localStorage.getItem('selectedChatId');
      if (selectedChatId) {
        const targetChat = chatRooms.find((chat: ChatRoom) => chat.id === selectedChatId);
        if (targetChat) {
          setSelectedChat(targetChat);
          localStorage.removeItem('selectedChatId'); // Clear after use
        }
      }
    }
  }, [isOpen, chatRooms]);

  // WebSocket connection
  useEffect(() => {
    if (!isAuthenticated || !user || !(user as any)?.id) return;

    let ws: WebSocket;
    
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws`;
        console.log("Connecting to WebSocket:", wsUrl);
        
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log("WebSocket connected");
          if ((user as any)?.id) {
            ws.send(JSON.stringify({
              type: "authenticate",
              userId: (user as any).id,
            }));
          }
          setSocket(ws);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === "new_message") {
            // Update chat rooms cache with new message
            queryClient.setQueryData(["/api/chat-rooms"], (oldData: ChatRoom[] = []) => {
              return oldData.map(chat => {
                if (chat.id === data.chatRoomId) {
                  return {
                    ...chat,
                    messages: [...(chat.messages || []), data.message],
                  };
                }
                return chat;
              });
            });

            // Update selected chat if it matches
            if (selectedChat && selectedChat.id === data.chatRoomId) {
              setSelectedChat(prev => prev ? {
                ...prev,
                messages: [...(prev.messages || []), data.message],
              } : null);
            }

            // Show notification if chat is not currently open
            if (!isOpen || !selectedChat || selectedChat.id !== data.chatRoomId) {
              toast({
                title: "New Message",
                description: `${data.message.sender.firstName}: ${data.message.content}`,
              });
            }
          }
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          setSocket(null);
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setSocket(null);
        };
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
      }
    };

    connectWebSocket();

    return () => {
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close();
      }
    };
  }, [isAuthenticated, user, queryClient, isOpen, selectedChat, toast]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageData: { chatRoomId: string; content: string }) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error("WebSocket connection not available");
      }
      
      socket.send(JSON.stringify({
        type: "chat_message",
        chatRoomId: messageData.chatRoomId,
        senderId: (user as any)?.id,
        content: messageData.content,
      }));
      
      return Promise.resolve();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    sendMessageMutation.mutate({
      chatRoomId: selectedChat.id,
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getOtherUser = (chat: ChatRoom) => {
    return chat.buyerId === (user as any)?.id ? chat.seller : chat.buyer;
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          className="bg-hema-orange text-white w-14 h-14 rounded-full shadow-lg hover:bg-hema-orange/90 transition flex items-center justify-center"
          onClick={() => setIsOpen(true)}
          data-chat-widget
        >
          <MessageCircle className="h-6 w-6" />
          {chatRooms.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-6 w-6 rounded-full flex items-center justify-center p-0">
              {chatRooms.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[600px] p-0">
          <div className="flex h-full">
            {/* Chat List Sidebar */}
            <div className="w-1/3 border-r flex flex-col">
              <DialogHeader className="p-4 border-b">
                <DialogTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Messages
                </DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="flex-1">
                {chatsLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading chats...</div>
                ) : chatRooms.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MessageCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p>No conversations yet</p>
                    <p className="text-sm">Start chatting with sellers about vehicles you're interested in</p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {chatRooms.filter((chat: ChatRoom) => chat.vehicle && chat.vehicle.brand).map((chat: ChatRoom) => {
                      const otherUser = getOtherUser(chat);
                      const lastMessage = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
                      
                      return (
                        <div
                          key={chat.id}
                          className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                            selectedChat?.id === chat.id ? "bg-hema-orange/10 border border-hema-orange" : ""
                          }`}
                          onClick={() => setSelectedChat(chat)}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={otherUser.profileImageUrl || ""} />
                              <AvatarFallback>
                                {otherUser.firstName[0]}{otherUser.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-sm truncate">
                                  {otherUser.firstName} {otherUser.lastName}
                                </h4>
                              </div>
                              <p className="text-xs text-gray-600 truncate">
                                {chat.vehicle?.brand} {chat.vehicle?.model} • {chat.vehicle?.vehicleNumber || `VH${String((chat.vehicle?.id || '').slice(-3)).padStart(3, '0')}`}
                              </p>
                              {lastMessage && (
                                <p className="text-xs text-gray-500 truncate mt-1">
                                  {lastMessage.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Car className="h-5 w-5 text-hema-orange" />
                        <div>
                          <h3 className="font-medium">
                            {selectedChat.vehicle.brand} {selectedChat.vehicle.model}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedChat.vehicle.vehicleNumber || `VH${String((selectedChat.vehicle.id || '').slice(-3)).padStart(3, '0')}`} • ₹{parseFloat(selectedChat.vehicle.price.toString()).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={getOtherUser(selectedChat).profileImageUrl || ""} />
                          <AvatarFallback className="text-xs">
                            {getOtherUser(selectedChat).firstName[0]}{getOtherUser(selectedChat).lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {getOtherUser(selectedChat).firstName} {getOtherUser(selectedChat).lastName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedChat.messages && selectedChat.messages.length > 0 ? (
                        selectedChat.messages.map((message: any) => {
                        const isOwnMessage = message.senderId === (user as any)?.id;
                        
                        return (
                          <div
                            key={message._id || message.id}
                            className={`flex items-start space-x-3 ${
                              isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
                            }`}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={message.sender.profileImageUrl || ""} />
                              <AvatarFallback className="text-xs">
                                {message.sender.firstName[0]}{message.sender.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-lg p-3 max-w-xs chat-bubble ${
                                isOwnMessage
                                  ? "bg-hema-orange text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwnMessage ? "text-white/75" : "text-gray-500"
                                }`}
                              >
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        disabled={sendMessageMutation.isPending}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        className="bg-hema-orange hover:bg-hema-orange/90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p>Choose a chat from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
