import useScrollToBottom from "../../hooks/useScrollToBottom";
import { MessageBubble } from "./MessageBubble";
import { NoConversationPlaceholder } from "./NoConversationPlaceholder";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";

export function MessageList() {
  const { activeConversation, activeConversationId } = useSelectedConversation();

  const lastMessageId = activeConversation?.messages.at(-1)?.id;
  const messagesScrollRef = useScrollToBottom(activeConversationId, lastMessageId);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-background/50 to-background">
      {activeConversation ? (
        <div
          ref={messagesScrollRef}
          className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4 sm:py-5 scroll-smooth"
        >
          <div className="flex justify-center mb-2">
            <div className="px-3 py-1 rounded-full bg-muted/40 backdrop-blur-sm">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted/70">
                Start of conversation
              </p>
            </div>
          </div>
          {activeConversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div className="h-2" />
        </div>
      ) : (
        <NoConversationPlaceholder />
      )}
    </div>
  );
}
