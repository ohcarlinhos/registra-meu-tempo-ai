<script lang="ts" setup>
import { CirclePlus, Trash2 } from "lucide-vue-next";
import { columns as tableColumns } from "./table/columns";

import { useDebounceFn } from "@vueuse/core";
import type { ColumnSort, SortingState } from "@tanstack/vue-table";

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

const categories = ref<CategoryMap[]>([]);
const categoriesIsFetch = ref(false);
const categoryFilter = ref<string>();

const debounceTrFetch = useDebounceFn(() => {
  trStore.refetchData();
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

const handleSort = (value: SortingState) => {
  let s = value[0];

  sort.value.id = s?.id || "lastTimeDate";
  sort.value.desc = s?.desc;

  let column = sort.value.id;

  if (column == "formattedTime") {
    column = "timeOnSeconds";
  }

  trStore.updateSort(sort.value.desc ? "desc" : "asc", column);
  debounceTrFetch();
};

const isMounted = ref(false);

const isLoading = computed(() => {
  return categoriesIsFetch.value || isPaginationFetch.value || !isMounted.value;
});

const sort = ref<ColumnSort>({
  id: "lastTimeDate",
  desc: true,
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

    sort.value.id = column;
    sort.value.desc = paginationQuery.value.sort == "desc";
  }

  trStore.updateSort(sort.value.desc ? "desc" : "asc", sort.value.id);
};

configTableDataAndFetch();

onMounted(() => {
  isMounted.value = true;
  categoriesIsFetch.value = true;

  categoryApi()
    .getAll(true)
    .then((result) => {
      if (result) categories.value = result;
      trStore.fetchData();
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

          <Button
            variant="outline"
            :disabled="isLoading"
            @click="emit('create')"
          >
            <CirclePlus />
            {{ "Criar Tarefa" }}
          </Button>
        </section>

        <div class="flex flex-col gap-3 md:gap-5 md:flex-row items-start">
          <GSearchV2
            class="w-full"
            :pagination-query="paginationQuery"
            :pagination-query-methods="trStore"
            :is-pagination-fetch="isLoading"
            using-store
          />

          <section class="flex gap-2 items-center">
            <section class="w-[120px]">
              <Select
                v-model="computedCategory"
                :disabled="!categories.length || isLoading"
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
              :disabled="!computedCategory || isLoading"
              variant="outline"
              :color="!computedCategory ? 'white' : 'red'"
              @click="computedCategory = ''"
            >
              <Trash2 />
              {{ "Limpar" }}
            </Button>
          </section>
        </div>
      </CardHeader>

      <CardContent class="flex flex-col gap-5">
        <GDataTable
          :columns="tableColumns"
          :data="tableData"
          :sort="sort"
          :loading="isLoading"
          @updated-sort="handleSort"
        />

        <GPaginationV2
          :page="apiRes?.page"
          :per-page="apiRes?.perPage"
          :total-pages="apiRes?.totalPages"
          :total-items="apiRes?.totalItems"
          :pagination-query="paginationQuery"
          :pagination-query-methods="trStore"
          :is-pagination-fetch="isLoading"
          total-label="Tarefas"
          using-store
        />
      </CardContent>
    </Card>
  </div>
</template>
