import { Button, NuxtLink } from "#components";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import Actions from "./Actions.vue";
import {
  AArrowDownIcon,
  AArrowUpIcon,
  ClockArrowUpIcon,
  ClockArrowDownIcon,
  CalendarArrowUpIcon,
  CalendarArrowDownIcon,
  CalendarIcon,
} from "lucide-vue-next";

export const columns: ColumnDef<TimeRecordTable>[] = [
  {
    accessorKey: "lastTimePeriodDate",
    header: ({ column }) =>
      h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(),
        },
        [
          column.getIsSorted() === "asc" && h(CalendarArrowUpIcon),
          column.getIsSorted() === "desc" && h(CalendarArrowDownIcon),
          "Iteração",
        ]
      ),
  },
  {
    accessorKey: "title",
    header: ({ column }) =>
      h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(),
        },
        [
          column.getIsSorted() === "asc" && h(AArrowUpIcon),
          column.getIsSorted() === "desc" && h(AArrowDownIcon),
          "Título",
        ]
      ),
    cell: ({ row }) =>
      h(
        NuxtLink,
        {
          to: {
            name: "record",
            params: { code: row.getValue("code") as string },
          },
          class: "hover:text-primary hover:underline",
        },
        row.getValue("title")
      ),
  },
  {
    accessorKey: "code",
    header: ({ column }) =>
      h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(),
        },
        [
          column.getIsSorted() === "asc" && h(AArrowUpIcon),
          column.getIsSorted() === "desc" && h(AArrowDownIcon),
          "Código",
        ]
      ),
  },
  {
    accessorKey: "categoryName",
    header: () => h("div", { variant: "ghost" }, ["Categoria"]),
  },
  {
    accessorKey: "formattedTime",
    header: ({ column }) =>
      h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(),
        },
        [
          column.getIsSorted() === "asc" && h(ClockArrowUpIcon),
          column.getIsSorted() === "desc" && h(ClockArrowDownIcon),
          "Tempo",
        ]
      ),
  },
  {
    accessorKey: "actions",
    header: () => h("div"),
    cell: ({ row }) =>
      h("div", { class: "text-right" }, h(Actions, { row: row.original })),
  },
];
