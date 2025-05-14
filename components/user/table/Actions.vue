<script setup lang="ts">
import { Trash2, EllipsisVertical, Edit } from "lucide-vue-next";
import type { UserMap } from "~/utils/types/api/map/UserMap";

defineProps<{
  row: UserMap;
}>();

const emit = defineEmits<{
  delete: [value: UserMap];
  edit: [value: UserMap];
}>();

const items = (row: UserMap) => [
  {
    label: "Editar",
    icon: Edit,
    click: () => emit("edit", row),
  },
  {
    label: "Excluir",
    icon: Trash2,
    click: () => emit("delete", row),
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
