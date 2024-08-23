<script lang="ts" setup>
export type DeletePayload = { id: number; page: number; perPage: number };

const { t } = useI18n();
const trStore = useTimeRecordStore();

const emit = defineEmits<{
  access: [value: string];
  delete: [value: DeletePayload];
  create: [];
}>();

const columns = [
  { key: "timeRecordDate", label: _$t("date") },
  { key: "code", label: _$t("code") },
  { key: "title", label: _$t("title") },
  { key: "categoryName", label: _$t("category") },
  { key: "formattedTime", label: _$t("time") },
  { key: "timePeriods", label: _$t("periods") },
  { key: "actions" },
];

const items = (row: TimeRecordType) => [
  [
    {
      label: t("access"),
      icon: "i-icon-park-outline-view-grid-detail",
      click: () => emit("access", row.code!),
    },
    {
      label: t("delete"),
      icon: "i-icon-park-outline-delete-themes",
      click: async () =>
        emit("delete", {
          id: row.id!,
          page: trStore.apiRes!.page,
          perPage: trStore.apiRes!.perPage,
        }),
    },
  ],
];

await trStore.fetch();
</script>

<template>
  <div class="flex-1">
    <UContainer
      :ui="{
        base: 'flex flex-col md:flex-row justify-between gap-5',
        padding: 'pb-5 px-0 lg:px-0 sm:px-0',
        constrained: 'max-w-8xl',
      }"
    >
      <h2 class="text-2xl font-bold">{{ _$t("records") }}</h2>

      <div class="flex gap-5 flex-row items-start mt-1 mr-1">
        <GSearch :perPage="trStore.apiRes?.perPage" :store="trStore" />

        <UButton
          :label="_$t('create')"
          icon="i-icon-park-outline-add"
          @click="emit('create')"
        />
      </div>
    </UContainer>

    <UCard>
      <UTable
        :columns="columns"
        :rows="trStore.timeRecordsTableData"
        :loading="trStore.isFetch"
      >
        <template #timePeriods-data="{ row }">
          <TimeRecordTableColTimePeriod
            :timePeriods="(row as ITimeRecordTable).timePeriods"
            :label="(row as ITimeRecordTable).timePeriodsCountText || '0'"
          />
        </template>

        <template #actions-data="{ row }">
          <div class="flex justify-end">
            <UDropdown :items="items(row)">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-icon-park-outline-more-one"
              />
            </UDropdown>
          </div>
        </template>
      </UTable>

      <GPagination
        :page="trStore.apiRes?.page"
        :perPage="trStore.apiRes?.perPage"
        :totalPages="trStore.apiRes?.totalPages"
        :totalItems="trStore.apiRes?.totalItems"
        :search="trStore.apiRes?.search"
        :store="trStore"
      />
    </UCard>
  </div>
</template>
