import { createElement } from "react";

import { RecentActionsWidget } from "@/components/widgets/recent-actions";
import useAdminSite from "@/hooks/useAdminSite";
import type { DashboardWidget } from "@/types";

const PREDEFINED_JSX: Record<string, any> = {
  "<RecentActionsWidget />": RecentActionsWidget,
};

export function Dashboard() {
  const { data } = useAdminSite();

  return (
    <div className="p-4 md:p-8 lg:p-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.data.widgets?.map((widget: DashboardWidget, idx: number) => (
          <div
            key={idx}
            style={{
              gridColumn: `span ${widget.colSpan} / span ${widget.colSpan}`,
            }}
          >
            {widget.useJsx
              ? PREDEFINED_JSX[widget.html]
                ? createElement(PREDEFINED_JSX[widget.html])
                : null
              : widget.html}
          </div>
        ))}
      </div>
    </div>
  );
}
