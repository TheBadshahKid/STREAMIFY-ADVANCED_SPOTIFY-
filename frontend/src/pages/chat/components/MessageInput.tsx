
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const { selectedUser, sendMessage } = useChatStore();
  const { isMobile } = useResponsive();

  const handleSend = () => {
    if (!selectedUser || !user || !newMessage.trim()) return;
    sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn(
      "border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-sm",
      isMobile ? "p-3" : "p-4"
    )}>
      <div className={cn(
        "flex gap-2 items-end",
        isMobile ? "gap-2" : "gap-3"
      )}>
        <div className="flex-1 relative">
          <Input
            placeholder={isMobile ? "Message..." : "Type a message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 resize-none transition-colors focus:border-zinc-600",
              isMobile ? "text-sm px-3 py-2 min-h-[40px]" : "text-sm px-4 py-3 min-h-[44px]"
            )}
            maxLength={1000}
          />
        </div>

        <Button
          size={isMobile ? "sm" : "default"}
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className={cn(
            "bg-green-500 hover:bg-green-600 transition-colors flex-shrink-0",
            isMobile ? "h-10 w-10 p-0" : "h-11 w-11 p-0"
          )}
        >
          <Send className={cn(
            "text-white",
            isMobile ? "size-4" : "size-4"
          )} />
        </Button>
      </div>
      
      {/* Character count for long messages */}
      {newMessage.length > 800 && (
        <div className="text-xs text-zinc-500 mt-1 text-right">
          {newMessage.length}/1000
        </div>
      )}
    </div>
  );
};

export default MessageInput;
