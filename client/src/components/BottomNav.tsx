import { NavLink } from "react-router-dom";

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white">
      <div className="mx-auto flex max-w-md justify-around px-4 py-3">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/locations">Locations</NavLink>
        <NavLink to="/library">Library</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>
    </nav>
  );
}
