<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, ColumnSort, SortingState } from "@tanstack/vue-table";
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
import { valueUpdater } from "~/lib/utils";
import { LoaderCircle } from "lucide-vue-next";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  sort?: ColumnSort;
  loading?: boolean;
  data: TData[];
}>();

const emit = defineEmits<{
  updatedSort: [value: SortingState];
}>();

const sorting = ref<SortingState>([]);

if (props.sort) {
  sorting.value.push(props.sort);
}

watch(
  () => props.sort,
  (value) => {
    sorting.value = value ? [value] : [];
  }
);

watch(
  () => sorting.value,
  (_) => {
    emit("updatedSort", sorting.value);
  }
);

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  state: {
    get sorting() {
      return sorting.value;
    },
  },
});
</script>

<template>
  <div class="border rounded-md">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>

        <template v-else-if="loading">
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              <span class="flex justify-center">
                <LoaderCircle
                  class="size-6 text-muted-foreground animate-spin"
                />
              </span>
            </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              Nenhum resultado.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
