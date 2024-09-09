import { useTranslate } from "@refinedev/core";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useRecentActions from "@/hooks/useRecentActions";
import type { RecentAction } from "@/types";

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
              className="border-b last-of-type:border-b-0 px-6 py-2"
            >
              <div>
                <Link
                  className="font-medium text-xs hover:underline"
                  to={`/content/${action.objectResourceId}/${action.objectId}`}
                >
                  {action.objectRepr}
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                {dayjs(action.actionTime).format("L LT")}
              </div>
              <div className="text-xs text-muted-foreground">
                {action.changeMessage}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
