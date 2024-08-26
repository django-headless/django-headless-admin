import { useTranslate } from "@refinedev/core";
import * as React from "react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const PaginationNavigation = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("flex w-full justify-end", className)}
    {...props}
  />
);
PaginationNavigation.displayName = "PaginationNavigation";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-3", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"button">
>(({ ...props }, ref) => (
  <li ref={ref}>
    <Button variant="outline" size="sm" {...props} />
  </li>
));
PaginationItem.displayName = "PaginationItem";

const Pagination = ({
  pages,
  current,
  onPageChange,
  ...props
}: React.ComponentProps<"nav"> & PaginationProps) => {
  const translate = useTranslate();

  return (
    <PaginationNavigation {...props}>
      <PaginationContent>
        <PaginationItem
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          <PiCaretLeftBold />
          <span>{translate("components.pagination.previous")}</span>
        </PaginationItem>
        <PaginationItem
          disabled={current >= pages}
          onClick={() => onPageChange(current + 1)}
        >
          <span>{translate("components.pagination.next")}</span>
          <PiCaretRightBold />
        </PaginationItem>
      </PaginationContent>
    </PaginationNavigation>
  );
};
Pagination.displayName = "Pagination";

interface PaginationProps {
  pages: number;
  current: number;
  onPageChange(page: number): void;
}

export { Pagination };
