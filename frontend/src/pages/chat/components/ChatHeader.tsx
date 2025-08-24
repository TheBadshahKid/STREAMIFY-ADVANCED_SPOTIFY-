
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatHeader = () => {
  const { selectedUser, onlineUsers, setSelectedUser } = useChatStore();
  const { windowSize } = useResponsive();
  const useMobileLayout = windowSize.width < 640; // sm breakpoint

  if (!selectedUser) return null;

  return (
    <div className="bg-zinc-900 border-b border-zinc-700 px-4 py-3 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Back Button */}
        {useMobileLayout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedUser(null)}
            className="p-2 hover:bg-zinc-800 text-zinc-100 hover:text-white flex-shrink-0 -ml-1"
            title="Back to conversations"
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}
        
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="size-10">
            <AvatarImage src={selectedUser.imageUrl} alt={selectedUser.fullName} />
            <AvatarFallback className="bg-purple-600 text-white font-semibold">
              {selectedUser.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Online Indicator */}
          <div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-zinc-900",
              onlineUsers.has(selectedUser.clerkId)
                ? "bg-green-500"
                : "bg-gray-500"
            )}
          />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-white text-base truncate">
            {selectedUser.fullName}
          </h2>
          <p className="text-zinc-400 text-sm">
            {onlineUsers.has(selectedUser.clerkId) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
