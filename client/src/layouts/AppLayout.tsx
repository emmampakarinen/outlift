import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { C } from "../shared/colors";

export function AppLayout() {
  return (
    <div className="h-dvh" style={{ background: C.bg }}>
      {" "}
      <div
        className="mx-auto flex h-dvh max-w-sm flex-col overflow-hidden"
        style={{
          background: C.bg,
        }}
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
