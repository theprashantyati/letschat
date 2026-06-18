import { Button, TextArea } from "@heroui/react";
import { ImageIcon, LoaderIcon, SendHorizontalIcon } from "lucide-react";
import { useRef } from "react";
import useKeyboardSound from "../../hooks/useKeyboardSound";
import { useChatStore } from "../../store/useChatStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";

export function ChatComposer() {
  const composerText = useChatStore((state) => state.composerText);
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const sendMediaMessage = useChatStore((state) => state.sendMediaMessage);
  const isSendingMedia = useChatStore((state) => state.isSendingMedia);
  const sendTextMessage = useChatStore((state) => state.sendTextMessage);
  const setComposerText = useChatStore((state) => state.setComposerText);
  const { activeConversationId } = useSelectedConversation();
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const mediaInputRef = useRef(null);

  const playSoundIfEnabled = () => {
    if (isSoundEnabled) playRandomKeyStrokeSound();
  };

  const handleSend = async () => {
    const didSendMessage = await sendTextMessage(activeConversationId);
    if (didSendMessage) playSoundIfEnabled();
  };

  const handleComposerTextChange = (event) => {
    setComposerText(event.target.value);
    playSoundIfEnabled();
  };

  const handleMediaPick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const didSendMessage = await sendMediaMessage({
      conversationId: activeConversationId,
      file,
    });

    if (didSendMessage) playSoundIfEnabled();
  };

  return (
    <footer className="shrink-0 border-t border-border/50 bg-background/95 px-2 pb-3 pt-3 sm:px-3 backdrop-blur-sm">
      {isSendingMedia ? (
        <div className="mx-auto mb-3 flex max-w-full items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent">
          <LoaderIcon
            className="size-4 shrink-0 animate-spin"
            strokeWidth={2}
            aria-hidden
          />
          <span className="truncate font-medium">Uploading media...</span>
        </div>
      ) : null}
      <div className="mx-auto flex w-full max-w-full items-end gap-2 px-0.5 sm:gap-2.5 sm:px-1">
        <input
          ref={mediaInputRef}
          type="file"
          accept="image/*,video/*"
          className="sr-only"
          disabled={isSendingMedia}
          tabIndex={-1}
          aria-hidden
          onChange={handleMediaPick}
        />
        <Button
          variant="light"
          isIconOnly
          isDisabled={isSendingMedia}
          className="size-10 shrink-0 touch-manipulation self-end text-accent hover:bg-accent/10 transition-colors"
          onPress={() => mediaInputRef.current?.click()}
        >
          <ImageIcon className="size-5 sm:size-6" strokeWidth={2} />
        </Button>
        <TextArea
          fullWidth
          variant="flat"
          placeholder="Type a message...\nShift + Enter for new line"
          rows={1}
          value={composerText}
          onChange={handleComposerTextChange}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 rounded-full transition-all"
        />

        <Button 
          isIconOnly 
          isDisabled={!composerText.trim()} 
          onPress={handleSend}
          className={`shrink-0 touch-manipulation transition-all self-end rounded-full ${
            composerText.trim()
              ? "bg-gradient-to-br from-accent to-accent/90 text-white shadow-md hover:shadow-lg"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <SendHorizontalIcon className="size-5" strokeWidth={2.5} />
        </Button>
      </div>
    </footer>
  );
}
