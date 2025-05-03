<script lang="ts" setup>
import { Trash2, EllipsisVertical, RefreshCcwDot, Save } from "lucide-vue-next";
import { useEventBus } from "@vueuse/core";
const { loggedIn } = useUserSession();

defineProps<{ row: TimeRecordLocalTable }>();

const bus = useEventBus<TimeRecordLocalTableBusEvent>(TRL_TABLE_BUS_NAME);

const items = (row: TimeRecordLocalTable) => {
  const actions = [
    {
      label: _$t("deleteLocalSession"),
      icon: Trash2,
      click: () =>
        bus.emit({
          action: "delete",
          data: row,
        }),
    },
  ];

  if (loggedIn.value) {
    if (row.id) {
      actions.unshift({
        label: _$t("syncSessionWithTask"),
        icon: RefreshCcwDot,
        click: () =>
          bus.emit({
            action: "sync",
            data: row,
          }),
      });
    } else {
      actions.unshift({
        label: _$t("bindSessionWithTask"),
        icon: RefreshCcwDot,
        click: () =>
          bus.emit({
            action: "bind",
            data: row,
          }),
      });

      actions.unshift({
        label: _$t("createTaskFromSession"),
        icon: Save,
        click: () =>
          bus.emit({
            action: "createFrom",
            data: row,
          }),
      });
    }
  }

  return actions;
};
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
