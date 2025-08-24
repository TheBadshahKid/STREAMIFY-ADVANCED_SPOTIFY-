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
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  // Auto-scroll to bottom on new messages
  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMobile) {
    return (
      <div className="h-full bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden flex flex-col rounded-lg">
        <div className="flex-1 flex flex-col min-h-0">
          {selectedUser ? (
            <>
              <ChatHeader />
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 overflow-x-hidden max-w-full">
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
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      
      {/* Main content grid */}
      <div className={cn(
        "grid h-[calc(100vh-180px)] min-h-0",
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
                <div className="bg-zinc-900 border-b border-zinc-700 px-4 py-3 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={selectedUser.imageUrl}
                          alt={selectedUser.fullName}
                        />
                        <AvatarFallback className="bg-purple-600 text-white font-semibold">
                          {selectedUser.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-zinc-900 bg-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-white text-base truncate">
                        {selectedUser.fullName}
                      </h2>
                      <p className="text-zinc-400 text-sm">Offline</p>
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent overflow-x-hidden max-w-full",
                    isTablet ? "px-3 py-3" : "px-4 py-4"
                  )}
                >
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
