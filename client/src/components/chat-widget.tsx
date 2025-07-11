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
  Bike,
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
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const processedMessageIds = useRef<Set<string>>(new Set());
  const viewedChatRooms = useRef<Set<string>>(new Set());

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
          viewedChatRooms.current.add(targetChat.id);
          localStorage.removeItem('selectedChatId'); // Clear after use
        }
      }
    }
  }, [isOpen, chatRooms]);

  // Update unread count
  useEffect(() => {
    if (chatRooms && chatRooms.length > 0) {
      // Count chats with unread messages
      const unreadChats = chatRooms.filter(chat => {
        // Skip if this chat is currently selected and open
        if (selectedChat && selectedChat.id === chat.id && isOpen) {
          return false;
        }
        
        // Skip if we've already viewed this chat in this session
        if (viewedChatRooms.current.has(chat.id)) {
          return false;
        }
        
        // Check if there are any messages and if the last message is from the other user
        return chat.messages && 
               chat.messages.length > 0 && 
               chat.messages[chat.messages.length - 1].senderId !== (user as any)?.id;
      });
      
      setUnreadCount(unreadChats.length);
    } else {
      setUnreadCount(0);
    }
  }, [chatRooms, selectedChat, isOpen, user]);

  // Mark current chat as viewed when selected
  useEffect(() => {
    if (selectedChat && isOpen) {
      viewedChatRooms.current.add(selectedChat.id);
    }
  }, [selectedChat, isOpen]);

  // WebSocket connection - only when chat widget is open
  useEffect(() => {
    if (!isAuthenticated || !user || !(user as any)?.id || !isOpen) return;

    // Close any existing socket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws`;
        console.log("Attempting WebSocket connection to:", wsUrl);
        
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

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
            // Check if we've already processed this message
            if (processedMessageIds.current.has(data.message._id)) {
              console.log("Skipping duplicate message:", data.message._id);
              return;
            }
            
            // Add to processed set
            processedMessageIds.current.add(data.message._id);
            
            // Ensure message has proper sender structure
            const message = {
              ...data.message,
              sender: {
                id: data.message.sender?.id || "",
                firstName: data.message.sender?.firstName || "",
                lastName: data.message.sender?.lastName || "",
                profileImageUrl: data.message.sender?.profileImageUrl || "",
              }
            };
            
            // Update chat rooms cache with new message
            queryClient.setQueryData(["/api/chat-rooms"], (oldData: ChatRoom[] = []) => {
              return oldData.map(chat => {
                if (chat.id === data.chatRoomId) {
                  return {
                    ...chat,
                    messages: [...(chat.messages || []), message],
                  };
                }
                return chat;
              });
            });

            // Update selected chat if it matches
            if (selectedChat && selectedChat.id === data.chatRoomId) {
              setSelectedChat(prev => prev ? {
                ...prev,
                messages: [...(prev.messages || []), message],
              } : null);
              
              // Mark this chat as viewed since we're currently looking at it
              viewedChatRooms.current.add(data.chatRoomId);
            } else {
              // If the message is not from the current user and we're not viewing this chat,
              // show a notification
              if (message.senderId !== (user as any)?.id) {
                toast({
                  title: "New Message",
                  description: `${message.sender.firstName || "User"}: ${message.content}`,
                });
              }
            }
            
            // Always invalidate the query to refresh the chat list
            queryClient.invalidateQueries({ queryKey: ["/api/chat-rooms"] });
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
      if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
        socketRef.current.close();
      }
    };
  }, [isAuthenticated, user, queryClient, toast, isOpen]);

  // Listen for custom events to select specific chats
  useEffect(() => {
    const handleSelectChat = (event: CustomEvent) => {
      const { chatRoomId } = event.detail;
      if (chatRoomId && chatRooms.length > 0) {
        const targetChat = chatRooms.find((chat: ChatRoom) => chat.id === chatRoomId);
        if (targetChat) {
          setSelectedChat(targetChat);
          viewedChatRooms.current.add(targetChat.id);
          setIsOpen(true);
        }
      }
    };

    window.addEventListener('selectChat', handleSelectChat as EventListener);
    return () => {
      window.removeEventListener('selectChat', handleSelectChat as EventListener);
    };
  }, [chatRooms]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageData: { chatRoomId: string; content: string }) => {
      return apiRequest("POST", `/api/chat-rooms/${messageData.chatRoomId}/messages`, {
        content: messageData.content,
      });
    },
    onSuccess: (data, variables) => {
      // The API returns the message directly, not wrapped in data.message
      const newMessage = data as any;
      
      // Add to processed set to prevent duplicates
      processedMessageIds.current.add(newMessage._id);
      
      // Ensure message has proper sender structure
      const safeMessage = {
        ...newMessage,
        sender: {
          id: newMessage.sender?.id || "",
          firstName: newMessage.sender?.firstName || "",
          lastName: newMessage.sender?.lastName || "",
          profileImageUrl: newMessage.sender?.profileImageUrl || "",
        }
      };
      
      // Update the selected chat with the new message (replace optimistic message)
      if (selectedChat && selectedChat.id === variables.chatRoomId) {
        setSelectedChat(prev => prev ? {
          ...prev,
          messages: [...(prev.messages || []).filter(msg => msg._id && !msg._id.startsWith('temp-')), safeMessage],
        } : null);
      }
      
      // Also update the chat rooms cache
      queryClient.setQueryData(["/api/chat-rooms"], (oldData: ChatRoom[] = []) => {
        return oldData.map(chat => {
          if (chat.id === variables.chatRoomId) {
            return {
              ...chat,
              messages: [...(chat.messages || []).filter(msg => msg._id && !msg._id.startsWith('temp-')), safeMessage],
            };
          }
          return chat;
        });
      });
      
      // Refresh chat rooms to get latest state
      queryClient.invalidateQueries({ queryKey: ["/api/chat-rooms"] });
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

    // Ensure we have a valid chat room ID
    const chatRoomId = selectedChat.id || (selectedChat as any)._id;
    if (!chatRoomId) {
      toast({
        title: "Error",
        description: "Invalid chat room. Please try refreshing the page.",
        variant: "destructive",
      });
      return;
    }

    // Create optimistic message to show immediately
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      content: newMessage.trim(),
      senderId: (user as any).id,
      createdAt: new Date().toISOString(),
      sender: {
        id: (user as any).id || "",
        firstName: (user as any).firstName || "",
        lastName: (user as any).lastName || "",
        profileImageUrl: (user as any).profileImageUrl || "",
      },
    };

    // Immediately add the message to the selected chat
    setSelectedChat(prev => prev ? {
      ...prev,
      messages: [...(prev.messages || []), optimisticMessage],
    } : null);

    // Clear the input immediately
    setNewMessage("");

    // Send the message to the server
    sendMessageMutation.mutate({
      chatRoomId: chatRoomId,
      content: optimisticMessage.content,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string | Date | number) => {
    if (!dateString) return "--:--";
    
    let date: Date;
    if (typeof dateString === 'string') {
      date = new Date(dateString);
    } else if (typeof dateString === 'number') {
      date = new Date(dateString);
    } else if (dateString instanceof Date) {
      date = dateString;
    } else {
      return "--:--";
    }
    
    if (isNaN(date.getTime())) return "--:--";
    
    return date.toLocaleTimeString("en-US", {
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
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-14 h-14 rounded-full shadow-lg transition flex items-center justify-center"
          onClick={() => setIsOpen(true)}
          data-chat-widget
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-6 w-6 rounded-full flex items-center justify-center p-0 animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        // When closing, refresh the chat rooms to update notification status
        if (!open) {
          queryClient.invalidateQueries({ queryKey: ["/api/chat-rooms"] });
        }
      }}>
        <DialogContent className="max-w-4xl h-[600px] p-0 overflow-hidden">
          <div className="flex h-full overflow-hidden">
            {/* Chat List Sidebar */}
            <div className="w-1/3 border-r flex flex-col">
              <DialogHeader className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
                <DialogTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-orange-500" />
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
                      const isUnread = lastMessage && 
                                      lastMessage.senderId !== (user as any)?.id && 
                                      !(selectedChat && selectedChat.id === chat.id) &&
                                      !viewedChatRooms.current.has(chat.id);
                      
                      return (
                        <div
                          key={chat.id}
                          className={`p-3 rounded-lg cursor-pointer hover:bg-orange-50 ${
                            selectedChat?.id === chat.id ? "bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200" : ""
                          } ${isUnread ? "bg-orange-50" : ""}`}
                          onClick={() => {
                            setSelectedChat(chat);
                            viewedChatRooms.current.add(chat.id);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={otherUser.profileImageUrl || ""} alt={`${otherUser.firstName} ${otherUser.lastName}`} onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }} />
                              <AvatarFallback>
                                {otherUser.firstName?.[0] || ""}{otherUser.lastName?.[0] || ""}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className={`font-medium text-sm truncate ${isUnread ? "font-bold" : ""}`}>
                                  {otherUser.firstName} {otherUser.lastName}
                                  {isUnread && (
                                    <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                                  )}
                                </h4>
                              </div>
                              <p 
                                className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer hover:underline truncate"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/vehicle/${chat.vehicleId}`;
                                }}
                              >
                                {chat.vehicle?.brand} {chat.vehicle?.model} • {chat.vehicle?.vehicleNumber || `VH${String((chat.vehicle?.id || '').slice(-3)).padStart(3, '0')}`}
                              </p>
                              {lastMessage && (
                                <p className={`text-xs ${isUnread ? "font-semibold text-gray-700" : "text-gray-500"} truncate mt-1`}>
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
                  <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bike className="h-5 w-5 text-orange-500" />
                        <div>
                          <h3 
                            className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                            onClick={() => window.location.href = `/vehicle/${selectedChat.vehicleId}`}
                          >
                            {selectedChat.vehicle.brand} {selectedChat.vehicle.model}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedChat.vehicle.vehicleNumber || `VH${String((selectedChat.vehicle.id || '').slice(-3)).padStart(3, '0')}`} • <span className="text-orange-600 font-medium">₹{parseFloat(selectedChat.vehicle.price.toString()).toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={getOtherUser(selectedChat).profileImageUrl || ""} alt={`${getOtherUser(selectedChat).firstName} ${getOtherUser(selectedChat).lastName}`} onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }} />
                          <AvatarFallback className="text-xs">
                            {getOtherUser(selectedChat).firstName?.[0] || ""}{getOtherUser(selectedChat).lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {getOtherUser(selectedChat).firstName} {getOtherUser(selectedChat).lastName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4 overflow-hidden">
                    <div className="space-y-4 overflow-y-auto">
                      {selectedChat.messages && selectedChat.messages.length > 0 ? (
                        selectedChat.messages.map((message: any, index: number) => {
                        const isOwnMessage = message.senderId === (user as any)?.id;
                        const messageKey = message._id || message.id || `message-${index}-${message.createdAt}`;
                        
                        return (
                          <div
                            key={messageKey}
                            className={`flex items-start space-x-3 ${
                              isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
                            }`}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage 
                                src={(message.sender?.profileImageUrl) || ""} 
                                alt={message.sender?.firstName ? `${message.sender.firstName} ${message.sender.lastName}` : "User"} 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }} 
                              />
                              <AvatarFallback className="text-xs">
                                {message.sender?.firstName?.[0] || ""}{message.sender?.lastName?.[0] || ""}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-lg p-3 max-w-[70%] chat-bubble ${
                                isOwnMessage
                                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
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
                        className="flex-1 focus-visible:ring-orange-500"
                        disabled={sendMessageMutation.isPending}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
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
