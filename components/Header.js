import Notification from "@/components/Notification";
import DarkModeToggle from "@/components/DarkModeToggle";
import MobileFieldDropdown from "@/components/MobileFieldDropdown";

export default function Header() {
  return (
    <>
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-baseball-green-700 via-baseball-green-600 to-baseball-sky-600 dark:from-baseball-green-400 dark:via-baseball-green-300 dark:to-baseball-sky-400 bg-clip-text text-transparent truncate">
              Walnut Creek Little League
            </h1>
            <div className="flex items-center gap-3">
              <MobileFieldDropdown />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Notification Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Notification />
      </div>
    </>
  );
}
