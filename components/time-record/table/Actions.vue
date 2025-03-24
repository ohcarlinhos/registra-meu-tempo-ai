<script lang="ts" setup>
import { useEventBus } from "@vueuse/core";
import { Trash2, EllipsisVertical } from "lucide-vue-next";

const bus = useEventBus<TimeRecordTable>("tr-table:delete");

defineProps<{ row: TimeRecordTable }>();

const items = (row: TimeRecordTable) => [
  {
    label: _$t("delete"),
    icon: Trash2,
    click: () => bus.emit(row),
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
      <Button variant="ghost" size="icon" disabled>
        <EllipsisVertical />
      </Button>
    </template>
  </ClientOnly>
</template>
