import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
// import Actions from "./Actions.vue";

export const columns: ColumnDef<UserMap>[] = [
  {
    accessorKey: "name",
    header: () => h("div", { variant: "ghost" }, ["Nome"]),
  },
  {
    accessorKey: "email",
    header: () => h("div", { variant: "ghost" }, ["Email"]),
  },
  {
    accessorKey: "lastUserAccess",
    header: () => h("div", { variant: "ghost" }, ["Último Acesso"]),
  },
  {
    accessorKey: "lastUserAccessType",
    header: () => h("div", { variant: "ghost" }, ["Tipo de Acesso"]),
  },
  {
    accessorKey: "lastUserAccessProvider",
    header: () => h("div", { variant: "ghost" }, ["Provedor"]),
  },
  {
    accessorKey: "createdAt",
    header: () => h("div", { variant: "ghost" }, ["Data de Criação"]),
  },
  // {
  //   accessorKey: "actions",
  //   header: () => h("div"),
  //   cell: ({ row }) =>
  //     h("div", { class: "text-right" }, h(Actions, { row: row.original })),
  // },
];
