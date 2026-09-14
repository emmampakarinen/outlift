import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-slate-100">
      <div className="mx-auto min-h-dvh max-w-md bg-[#fbfdfc] pb-24">
        <Outlet />
        <BottomNav />
      </div>
    </div>
  );
}