"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const enhanceTables = () => {
  document.querySelectorAll<HTMLTableElement>("main table").forEach((table) => {
    table.classList.add("responsive-card-table");

    const headings = Array.from(
      table.querySelectorAll<HTMLTableCellElement>("thead th"),
    ).map((heading) => heading.textContent?.trim() || "");

    table.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row) => {
      Array.from(row.cells).forEach((cell, index) => {
        if (cell.tagName !== "TD" || cell.hasAttribute("data-label")) return;
        cell.setAttribute(
          "data-label",
          cell.colSpan > 1 ? "" : headings[index] || `Detail ${index + 1}`,
        );
      });
    });
  });
};

export function ResponsiveTableEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    enhanceTables();
    const observer = new MutationObserver(enhanceTables);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
