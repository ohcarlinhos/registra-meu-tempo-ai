<script lang="ts" setup>
const trStore = useTimeRecordStore();

const emit = defineEmits<{
  access: [value: string];
  delete: [value: TimeRecordMap];
  create: [];
}>();

const columns = [
  { key: "lastTimePeriodDate", label: "Último Progresso" },
  { key: "title", label: _$t("title") },
  { key: "code", label: _$t("code") },
  { key: "categoryName", label: _$t("category") },
  { key: "formattedTime", label: _$t("time") },
  { key: "timePeriodCountText", label: _$t("periods") },
  { key: "actions" },
];

const items = (row: TimeRecordMap) => [
  [
    {
      label: _$t("delete"),
      icon: "i-icon-park-outline-delete-themes",
      click: async () => emit("delete", row),
    },
  ],
];

const categories = ref<CategoryMap[]>([]);
const categoriesIsFetch = ref(false);
const categoryFilter = ref<string>();

const hasFilter = trStore.paginationQuery.filters.find(
  (e) => e.tag === "category"
);
if (hasFilter) categoryFilter.value = hasFilter.value;

const computedCategory = computed({
  get: () => {
    return categoryFilter.value || "";
  },
  set: (category: string) => {
    const oldCategory = categoryFilter.value;
    categoryFilter.value = category;

    if (category === oldCategory) return;

    trStore.paginationQuery.addFilter({ tag: "category", value: category });
    trStore.fetch(true);
  },
});

const isFetch = computed(() => {
  return categoriesIsFetch.value || trStore.isFetch;
});

onMounted(() => {
  categoriesIsFetch.value = true;
  getAllCategories(true)
    .then((result) => {
      if (result) categories.value = result;
      return trStore.fetch();
    })
    .finally(() => {
      categoriesIsFetch.value = false;
    });
});
</script>

<template>
  <div class="flex-1">
    <UContainer
      :ui="{
        base: 'flex flex-col md:flex-row justify-between gap-5',
        padding: 'pb-6 px-0 lg:px-0 sm:px-0',
        constrained: 'max-w-8xl',
      }"
    >
      <section class="flex items-center gap-5">
        <h2 class="text-4xl font-bold">{{ $t("records") }}</h2>

        <UButton
          :label="_$t('create')"
          icon="i-icon-park-outline-add"
          @click="emit('create')"
        />
      </section>

      <div class="flex flex-col gap-5 md:flex-row items-start mt-1 mr-1">
        <section class="flex gap-2">
          <USelectMenu
            v-model="computedCategory"
            :options="categories"
            :disabled="isFetch"
            value-attribute="id"
            option-attribute="name"
            :placeholder="_$t('category')"
          />

          <UButton
            :label="_$t('clear')"
            :disabled="!computedCategory || isFetch"
            variant="outline"
            :color="!computedCategory ? 'white' : 'red'"
            @click="computedCategory = ''"
          />
        </section>

        <GSearch :store="trStore" :is-fetch="isFetch" />
      </div>
    </UContainer>

    <UCard>
      <UTable
        :columns="columns"
        :rows="trStore.timeRecordsTableData"
        :loading="isFetch"
      >
        <template #actions-data="{ row }">
          <div class="flex justify-end gap-2">
            <UButton
              :label="_$t('access')"
              color="gray"
              @click="() => emit('access', row.code!)"
            />

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
        :store="trStore"
        :is-fetch="isFetch"
      />
    </UCard>
  </div>
</template>
