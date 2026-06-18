import { Avatar, Button } from "@heroui/react";
import { ChevronLeftIcon, Volume2Icon, VolumeXIcon, XIcon } from "lucide-react";
import { AppLogo } from "../AppLogo";
import { AvatarWithOnlineIndicator } from "./AvatarWithOnlineIndicator";

import { ThemePresetPicker } from "../ThemePresetPicker";

import { ThemeToggle } from "../ThemeToggle";
import { WallpaperPicker } from "../WallpaperPicker";

import { useChatStore } from "../../store/useChatStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";

export function ChatHeader() {
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);
  const setSoundEnabled = useChatStore((state) => state.setSoundEnabled);

  const { activeConversation, isLargeScreen } = useSelectedConversation();

  return (
    <header className="sticky top-0 z-10 flex shrink-0 flex-wrap items-center gap-2 border-b border-border/50 bg-gradient-to-b from-background via-background to-transparent px-2 py-2 sm:gap-2.5 sm:px-3 sm:py-2.5 backdrop-blur-sm">
      {activeConversation && !isLargeScreen ? (
        <Button
          variant="light"
          size="sm"
          isIconOnly
          className="shrink-0 hover:bg-muted/50 transition-colors"
          onPress={() => setActiveConversationId(null)}
        >
          <ChevronLeftIcon className="size-6" strokeWidth={2.25} />
        </Button>
      ) : null}

      {activeConversation ? (
        <>
          <AvatarWithOnlineIndicator isOnline={activeConversation.peer.isOnline ?? true}>
            <Avatar className="size-10 shrink-0 ring-2 ring-accent/20">
              <Avatar.Image
                alt={activeConversation.peer.name}
                src={activeConversation.peer.avatarUrl}
              />
              <Avatar.Fallback className="text-sm font-semibold bg-gradient-to-br from-accent/40 to-accent/30">
                {activeConversation.peer.initials}
              </Avatar.Fallback>
            </Avatar>
          </AvatarWithOnlineIndicator>

          <div className="flex-1 text-center sm:text-left">
            <p className="truncate text-sm font-bold leading-tight text-foreground">
              {activeConversation.peer.name}
            </p>
            <p className="truncate text-xs text-muted mt-0.5">
              {activeConversation.peer.isOnline ? (
                <span className="font-semibold text-success/80">🟢 Active now</span>
              ) : (
                <span className="text-muted-foreground">Offline</span>
              )}
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center gap-3 sm:text-left">
          <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg p-2">
            <AppLogo size={32} className="rounded-lg" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="truncate text-xs font-semibold text-muted/60">No conversation selected</p>
            <p className="text-[11px] text-muted/40">Choose a user to start chatting</p>
          </div>
        </div>
      )}

      <div className="ml-auto flex max-w-full shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-1.5">
        <div className="hidden min-[400px]:contents">
          <WallpaperPicker />
          <ThemePresetPicker />
        </div>

        <ThemeToggle />

        <Button
          variant="light"
          size="sm"
          isIconOnly
          className="shrink-0"
          aria-pressed={isSoundEnabled}
          onPress={() => setSoundEnabled(!isSoundEnabled)}
        >
          {isSoundEnabled ? (
            <Volume2Icon className="size-5.5" strokeWidth={2} aria-hidden />
          ) : (
            <VolumeXIcon className="size-5.5" strokeWidth={2} aria-hidden />
          )}
        </Button>

        {activeConversation ? (
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            className="shrink-0"
            aria-label="Close chat"
            onPress={() => setActiveConversationId(null)}
          >
            <XIcon className="size-5.5" strokeWidth={2} aria-hidden />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
