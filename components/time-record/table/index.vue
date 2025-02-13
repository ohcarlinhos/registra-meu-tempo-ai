<script lang="ts" setup>
import { CirclePlus, Eye, EllipsisVertical, Trash } from "lucide-vue-next";

import { useDebounceFn } from "@vueuse/core";

const trStore = useTimeRecordStore();
const {
  paginationQuery,
  tableData,
  apiRes,
  isFetch: isPaginationFetch,
} = storeToRefs(trStore);

const emit = defineEmits<{
  access: [value: string];
  delete: [value: TimeRecordMap];
  create: [];
}>();

const columns = [
  { key: "lastTimePeriodDate", label: "Iteração", sortable: true },
  { key: "formattedTime", label: _$t("time"), sortable: true },
  {
    key: "title",
    label: _$t("title"),
    sortable: true,
    rowClass: "truncate",
  },
  { key: "code", label: _$t("code"), sortable: true, rowClass: "truncate" },
  { key: "categoryName", label: _$t("category") },
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

const debounceTrFetch = useDebounceFn(() => {
  trStore.fetchData();
}, 1000);

const computedCategory = computed({
  get: () => {
    return categoryFilter.value || "";
  },

  set: (category: string) => {
    const oldCategory = categoryFilter.value;
    categoryFilter.value = category;

    if (category === oldCategory) {
      return;
    }

    trStore.addFilter({ tag: "category", value: category });
    debounceTrFetch();
  },
});

const sort = ref<{ column: string; direction: "asc" | "desc" }>({
  column: "lastTimePeriodDate",
  direction: "desc",
});

const computedSort = computed({
  get: () => {
    return sort.value;
  },

  set: (newSort?: { column: string | null; direction: "asc" | "desc" }) => {
    sort.value = {
      column: newSort?.column || "",
      direction: newSort?.direction || "desc",
    };

    let column = sort.value?.column || "";

    if (column == "formattedTime") {
      column = "timeOnSeconds";
    }

    trStore.updateSort(sort.value?.direction, column);
    debounceTrFetch();
  },
});

const isFetch = computed(() => {
  return categoriesIsFetch.value || trStore.isFetch;
});

const configTableDataAndFetch = () => {
  const hasFilter = paginationQuery.value.filters.find(
    (e) => e.tag === "category"
  );

  if (hasFilter) {
    categoryFilter.value = hasFilter.value;
  }

  if (paginationQuery.value.sortProp) {
    let column = paginationQuery.value.sortProp;

    if (column == "timeOnSeconds") {
      column = "formattedTime";
    }

    sort.value = {
      column,
      direction: paginationQuery.value.sort,
    };
  }

  trStore.updateSort(sort.value.direction, sort.value.column);
  return trStore.fetchData();
};

onMounted(() => {
  categoriesIsFetch.value = true;

  categoryApi()
    .getAll(true)
    .then((result) => {
      if (result) categories.value = result;
      return configTableDataAndFetch();
    })
    .finally(() => {
      categoriesIsFetch.value = false;
    });
});
</script>

<template>
  <div class="flex-1">
    <Card>
      <CardHeader class="flex-col md:flex-row gap-3 md:gap-5 justify-between">
        <section class="flex flex-row gap-4 items-center">
          <CardTitle>
            {{ "Tarefas" }}
          </CardTitle>

          <Button variant="outline" @click="emit('create')">
            <CirclePlus />
            {{ "Criar Tarefa" }}
          </Button>
        </section>

        <div class="flex flex-col gap-3 md:gap-5 md:flex-row items-start">
          <GSearchV2
            class="w-full"
            :pagination-query="paginationQuery"
            :pagination-query-methods="trStore"
            :is-pagination-fetch="isPaginationFetch"
            using-store
          />

          <section class="flex gap-2 items-center">
            <section class="w-[120px]">
              <Select
                v-model="computedCategory"
                :disabled="isPaginationFetch || isFetch"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="item in categories"
                      :value="item.id.toString()"
                    >
                      {{ item.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </section>

            <Button
              :disabled="!computedCategory || isFetch"
              variant="outline"
              :color="!computedCategory ? 'white' : 'red'"
              @click="computedCategory = ''"
            >
              <Trash />
              {{ "Limpar" }}
            </Button>
          </section>
        </div>
      </CardHeader>

      <CardContent class="flex flex-col gap-5">
        <UTable
          :columns="columns"
          :rows="tableData"
          :loading="isFetch"
          v-model:sort="computedSort"
          sort-mode="manual"
        >
          <template #actions-data="{ row }">
            <div class="flex justify-end gap-2">
              <Button
                variant="outline"
                @click="() => emit('access', row.code!)"
              >
                <Eye />
                {{ "Acessar" }}
              </Button>

              <UDropdown :items="items(row)">
                <Button variant="outline" size="icon">
                  <EllipsisVertical />
                </Button>
              </UDropdown>
            </div>
          </template>
        </UTable>

        <GPaginationV2
          :page="apiRes?.page"
          :per-page="apiRes?.perPage"
          :total-pages="apiRes?.totalPages"
          :total-items="apiRes?.totalItems"
          :pagination-query="paginationQuery"
          :pagination-query-methods="trStore"
          :is-pagination-fetch="isPaginationFetch"
          total-label="Tarefas"
          using-store
        />
      </CardContent>
    </Card>
  </div>
</template>
