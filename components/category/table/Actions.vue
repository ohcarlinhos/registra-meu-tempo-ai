<script lang="ts" setup>
import { Trash2, EllipsisVertical, Edit } from "lucide-vue-next";
import { useEventBus } from "@vueuse/core";

defineProps<{ row: CategoryMap }>();

const bus = useEventBus<CategoryTableBusEvent>(CATEGORY_TABLE_BUS_NAME);

const items = (row: CategoryMap) => [
  {
    label: _$t("edit"),
    icon: Edit,
    click: () =>
      bus.emit({
        action: "edit",
        data: row,
      }),
  },
  {
    label: _$t("delete"),
    icon: Trash2,
    click: () =>
      bus.emit({
        action: "delete",
        data: row,
      }),
  },
];
</script>

<template>
  <ClientOnly>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Opções</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem v-for="item in items(row)" @click="item.click">
          <component :is="item.icon" />
          {{ item.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <template #fallback>
      <Button variant="ghost" size="icon">
        <EllipsisVertical />
      </Button>
    </template>
  </ClientOnly>
</template>
