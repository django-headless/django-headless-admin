import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex items-center justify-center min-h-dvh bg-accent">
      <div className="flex flex-col items-center gap-8 w-full px-4 max-w-sm">
        <Outlet />
        <div>
          <img
            src="/logo.svg"
            className="h-8 w-auto object-contain select-none"
            alt="Django Headless"
          />
        </div>
      </div>
    </div>
  );
}
