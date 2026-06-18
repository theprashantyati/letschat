import { APP_NAME, AppLogo } from "../AppLogo";
import { ThemePresetPicker } from "../ThemePresetPicker";
import { ThemeToggle } from "../ThemeToggle";
import { WallpaperPicker } from "../WallpaperPicker";

function AuthHeader() {
  return (
    <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-accent/10 bg-gradient-to-b from-background via-background to-background/95 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex flex-1 items-center gap-3 px-0">
        <div className="bg-gradient-to-br from-accent to-accent/80 rounded-xl p-2 shadow-md">
          <AppLogo size={24} className="rounded-lg" alt="" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate text-base font-bold leading-tight text-foreground sm:text-lg">{APP_NAME}</p>
          <p className="truncate text-xs text-muted mt-0.5">Secure & Private</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <WallpaperPicker />

        <ThemePresetPicker />

        <ThemeToggle />
      </div>
    </header>
  );
}
export default AuthHeader;
