import { Button, NuxtLink } from "#components";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";

import Actions from "./Actions.vue";

import { AArrowDownIcon, AArrowUpIcon } from "lucide-vue-next";

export const columns: ColumnDef<CategoryMap>[] = [
  {
    accessorKey: "name",
    header: () => h("div", { variant: "ghost" }, ["Categoria"]),
  },
  {
    accessorKey: "actions",
    header: () => h("div"),
    cell: ({ row }) =>
      h("div", { class: "text-right" }, h(Actions, { row: row.original })),
  },
];
