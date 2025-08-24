
import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";

const UsersList = () => {
  const {
    users,
    selectedUser,
    isLoading,
    setSelectedUser,
    onlineUsers,
  } = useChatStore();

  return (
    <div className="h-full flex flex-col bg-zinc-900/30">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/50">
        <h2 className="text-white font-semibold text-sm">Messages</h2>
      </div>
      
      {/* Users Scrollable List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-3">
          {isLoading ? (
            <UsersListSkeleton />
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedUser?.clerkId === user.clerkId
                    ? "bg-green-500/20 border-l-2 border-green-500"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="size-10">
                    <AvatarImage src={user.imageUrl} alt={user.fullName} />
                    <AvatarFallback className="bg-zinc-700 text-zinc-200">
                      {user.fullName[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Online Indicator */}
                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900 ${
                      onlineUsers.has(user.clerkId)
                        ? "bg-green-500"
                        : "bg-zinc-500"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate text-sm">
                    {user.fullName}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {onlineUsers.has(user.clerkId) ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UsersList;
