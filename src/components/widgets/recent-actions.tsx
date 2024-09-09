import { useTranslate } from "@refinedev/core";
import dayjs from "dayjs";
import {
  PiPencilSimpleDuotone,
  PiPlus,
  PiTrashSimpleDuotone,
} from "react-icons/pi";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useRecentActions from "@/hooks/useRecentActions";
import type { RecentAction } from "@/types";
import { cn } from "@/utils/cn";

const ICONS = {
  ADDITION: <PiPlus />,
  CHANGE: <PiPencilSimpleDuotone />,
  DELETION: <PiTrashSimpleDuotone />,
};

export function RecentActionsWidget() {
  const translate = useTranslate();
  const { data } = useRecentActions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {translate("components.widgets.recent_actions.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 border-t">
        <ul>
          {data?.data.map((action: RecentAction) => (
            <li
              key={action.id}
              className="border-b last-of-type:border-b-0 px-6 py-2 flex items-center gap-3"
            >
              <div
                className={cn("shrink-0", {
                  "text-rose-500": action.actionFlag === "DELETION",
                  "text-emerald-500": action.actionFlag === "ADDITION",
                  "text-yellow-500": action.actionFlag === "CHANGE",
                })}
              >
                {ICONS[action.actionFlag]}
              </div>
              <div className="flex-1">
                <div>
                  <Link
                    className="font-medium text-xs/tight hover:underline inline-block"
                    to={`/content/${action.objectResourceId}/${action.objectId}`}
                  >
                    {action.objectRepr}
                  </Link>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {dayjs(action.actionTime).format("L LT")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {action.changeMessage}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
