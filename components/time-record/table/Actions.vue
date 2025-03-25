<script lang="ts" setup>
import { useEventBus } from "@vueuse/core";
import { Trash2, EllipsisVertical, Link } from "lucide-vue-next";

defineProps<{ row: TimeRecordTable }>();

const bus = useEventBus<TimeRecordTableBusEvent>(TR_TABLE_BUS_NAME);

const items = (row: TimeRecordTable) => [
  {
    label: _$t("access"),
    icon: Link,
    click: () => bus.emit({ action: "access", data: row }),
  },
  {
    label: _$t("delete"),
    icon: Trash2,
    click: () => bus.emit({ action: "delete", data: row }),
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
