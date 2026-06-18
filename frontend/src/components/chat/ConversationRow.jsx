import { Avatar } from "@heroui/react";
import { AvatarWithOnlineIndicator } from "./AvatarWithOnlineIndicator";

export function ConversationRow({ user, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-all duration-200 hover:bg-muted/50 border-b border-border/30 group ${
        selected ? "bg-accent/15 border-accent/30" : ""
      }`}
    >
      <AvatarWithOnlineIndicator isOnline={user.isOnline ?? true}>
        <Avatar className={`shrink-0 ${selected ? "ring-2 ring-accent/50" : "group-hover:ring-2 group-hover:ring-accent/30"} transition-all size-12`}>
          <Avatar.Image alt={user.name} src={user.avatarUrl} />
          <Avatar.Fallback className="text-sm font-semibold bg-gradient-to-br from-accent/30 to-accent/20">
            {user.initials}
          </Avatar.Fallback>
        </Avatar>
      </AvatarWithOnlineIndicator>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold transition-colors ${selected ? "text-accent" : "text-foreground group-hover:text-accent/80"}`}>
          {user.name}
        </p>
        <p className="text-xs text-muted truncate mt-0.5 transition-colors group-hover:text-muted/80">
          {user.isOnline ? "Active now" : "Offline"}
        </p>
      </div>
    </button>
  );
}
