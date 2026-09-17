import { Home, MapPin, BookOpen, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { C } from "../shared/colors";

export function BottomNav() {
  const navItems = [
    {
      to: "/home",
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
    <nav
      className="z-50 shrink-0 border-t"
      style={{
        background: C.card,
        borderColor: C.border,
      }}
    >
      <div className="grid grid-cols-4 px-2 pb-5 pt-2.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center justify-center gap-1 py-1"
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={2}
                  color={isActive ? C.forest : C.textFaint}
                />

                <span
                  className="text-xs font-medium"
                  style={{
                    color: isActive ? C.forest : C.textFaint,
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
