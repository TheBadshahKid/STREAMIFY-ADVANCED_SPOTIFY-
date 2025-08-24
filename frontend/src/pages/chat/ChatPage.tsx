import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useLayoutEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const { isMobile, isTablet, windowSize } = useResponsive();

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  // Temporarily disabled auto-scroll to test manual scrolling
  // useLayoutEffect(() => {
  //   if (messagesEndRef.current && chatScrollRef.current) {
  //     const scrollContainer = chatScrollRef.current;
  //     const scrollHeight = scrollContainer.scrollHeight;
  //     const scrollTop = scrollContainer.scrollTop;
  //     const clientHeight = scrollContainer.clientHeight;
  //     
  //     // Only auto-scroll if user is near the bottom (within 100px) or if it's a new conversation
  //     const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
  //     
  //     if (isNearBottom || messages.length === 1) {
  //       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //     }
  //   }
  // }, [messages]);

  // // Scroll to bottom when a new conversation is selected
  // useLayoutEffect(() => {
  //   if (selectedUser && messagesEndRef.current) {
  //     // Use setTimeout to ensure DOM has updated
  //     setTimeout(() => {
  //       messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  //     }, 100);
  //   }
  // }, [selectedUser]);

  // For very small screens (phones), use single-pane mobile layout
  const useMobileLayout = windowSize.width < 640; // sm breakpoint
  
  if (useMobileLayout) {
    return (
      <div className="h-screen max-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col min-h-0">
          {selectedUser ? (
            <>
              <ChatHeader />
              <div 
                ref={chatScrollRef}
                className="flex-1 px-3 py-4 space-y-3 overflow-y-auto overflow-x-hidden max-w-full"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#71717a #27272a'
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={cn(
                      "flex items-end gap-2 max-w-full overflow-hidden",
                      message.senderId === user?.id ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Avatar className="size-6 flex-shrink-0">
                      <AvatarImage
                        src={
                          message.senderId === user?.id
                            ? user.imageUrl
                            : selectedUser.imageUrl
                        }
                      />
                    </Avatar>
                    <div
                      className={cn(
                        "rounded-2xl px-3 py-2 max-w-[75%] chat-bubble overflow-hidden",
                        message.senderId === user?.id
                          ? "bg-green-500 text-white rounded-br-md"
                          : "bg-zinc-700 text-zinc-100 rounded-bl-md"
                      )}
                      style={{
                        wordBreak: "break-all",
                        overflowWrap: "anywhere",
                        maxWidth: "75%",
                        overflow: "hidden",
                      }}
                    >
                      <p
                        className="text-sm leading-relaxed chat-message"
                        style={{
                          wordBreak: "break-all",
                          overflowWrap: "anywhere",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {message.content}
                      </p>
                      <span
                        className={cn(
                          "text-xs mt-1 block opacity-70",
                          message.senderId === user?.id
                            ? "text-green-100"
                            : "text-zinc-300"
                        )}
                      >
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <MessageInput />
            </>
          ) : (
            <div className="flex-1">
              <UsersList />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="rounded-md overflow-hidden h-screen max-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900 flex flex-col">
      <Topbar />
      
      {/* Main content grid */}
      <div className={cn(
        "grid flex-1 min-h-0",
        isTablet ? "grid-cols-[250px_1fr]" : "grid-cols-[300px_1fr]"
      )}>
        {/* Sidebar */}
        <div className="border-r border-zinc-800/50 flex flex-col h-full">
          <UsersList />
        </div>
        
        {/* Chat area */}
        <div className="flex flex-col h-full min-w-0">
            {selectedUser ? (
              <>
                <ChatHeader />
                <div 
                  ref={chatScrollRef}
                  className={cn(
                    "space-y-4 overflow-y-scroll overflow-x-hidden",
                    isTablet ? "px-3 py-3" : "px-4 py-4"
                  )}
                  style={{
                    height: 'calc(100vh - 280px)', // Explicit height for scroll container
                    minHeight: '400px',
                    maxHeight: 'calc(100vh - 280px)'
                  }}
                >
                  {/* Temporary test messages to verify scrolling */}
{/*                   {[...Array(20)].map((_, i) => (
                    <div key={`temp-${i}`} className="p-3 bg-zinc-700 rounded-lg text-white mb-3">
                      <div className="font-medium text-green-400">Test Message {i + 1}</div>
                      <div className="text-sm text-zinc-300 mt-1">
                        This is test message number {i + 1} to verify that scrolling works properly.
                      </div>
                      <div className="text-xs text-zinc-400 mt-2">{new Date().toLocaleTimeString()}</div>
                    </div>
                  ))} */}
                  
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={cn(
                        "flex items-start gap-3 max-w-full overflow-hidden",
                        message.senderId === user?.id
                          ? "flex-row-reverse"
                          : "flex-row"
                      )}
                    >
                      <Avatar
                        className={cn(
                          "flex-shrink-0",
                          isTablet ? "size-7" : "size-8"
                        )}
                      >
                        <AvatarImage
                          src={
                            message.senderId === user?.id
                              ? user.imageUrl
                              : selectedUser.imageUrl
                          }
                        />
                      </Avatar>
                      <div
                        className={cn(
                          "rounded-lg chat-bubble overflow-hidden",
                          isTablet ? "p-2 max-w-[75%]" : "p-3 max-w-[70%]",
                          message.senderId === user?.id
                            ? "bg-green-500 text-white"
                            : "bg-zinc-800 text-zinc-200"
                        )}
                        style={{
                          wordBreak: "break-all",
                          overflowWrap: "anywhere",
                          maxWidth: isTablet ? "75%" : "70%",
                          overflow: "hidden",
                        }}
                      >
                        <p
                          className={cn(
                            "leading-relaxed chat-message",
                            isTablet ? "text-xs" : "text-sm"
                          )}
                          style={{
                            wordBreak: "break-all",
                            overflowWrap: "anywhere",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {message.content}
                        </p>
                        <span
                          className={cn(
                            "text-zinc-300 mt-1 block opacity-80",
                            isTablet ? "text-xs" : "text-xs"
                          )}
                        >
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex-shrink-0">
                  <MessageInput />
                </div>
              </>
            ) : (
              <NoConversationPlaceholder />
            )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="/spotify.png" alt="Spotify" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);
