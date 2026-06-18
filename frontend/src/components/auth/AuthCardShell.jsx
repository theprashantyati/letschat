const cardClassName = [
  "relative overflow-hidden rounded-2xl",
  "border border-accent/20 bg-gradient-to-r from-background via-background to-background/95 backdrop-blur-2xl",
  "shadow-[0_20px_70px_-20px_rgba(0,0,0,0.15),0_0_1px_rgba(0,0,0,0.05)]",
  "dark:border-accent/30 dark:bg-gradient-to-r dark:from-background dark:via-background dark:to-background/90",
  "dark:shadow-[0_20px_70px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)_inset]",
].join(" ");

export function AuthCardShell({ children }) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-md">
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-b from-accent/20 via-accent/5 to-transparent opacity-60 dark:from-accent/30 dark:via-accent/10 dark:opacity-80 blur-xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.4)_inset] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset]"
        />

        <div className={cardClassName}>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-accent/10 blur-3xl dark:bg-accent/15"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent dark:via-accent/40"
          />

          <div className="relative px-6 pb-8 pt-9 sm:px-8 sm:pb-9 sm:pt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
