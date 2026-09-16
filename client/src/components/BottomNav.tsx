import { Home, MapPin, BookOpen, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

export function BottomNav() {
  const navItems = [
    {
      to: "/",
      label: "Home",
      icon: Home,
    },
    {
      to: "/locations",
      label: "Locations",
      icon: MapPin,
    },
    {
      to: "/library",
      label: "Library",
      icon: BookOpen,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: UserRound,
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 pb-2 pt-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-xs font-medium transition ${
                isActive
                  ? "text-[#1a4332]"
                  : "text-slate-400 hover:text-slate-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={21} strokeWidth={isActive ? 2.4 : 2} />

                <span className={isActive ? "font-semibold" : ""}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
