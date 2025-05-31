<script lang="ts" setup>
import { columns as tableColumns } from "./table/columns";
import type { UserMap } from "~/utils/types/api/map/UserMap";
import type { ColumnSort, SortingState } from "@tanstack/vue-table";
import { useDebounceFn } from "@vueuse/core";

const userStore = useUserStore();
const {
  paginationQuery,
  tableData,
  apiRes,
  isFetch: isPaginationFetch,
} = storeToRefs(userStore);

defineEmits<{
  create: [];
  delete: [value: UserMap];
  edit: [value: UserMap];
}>();

const isMounted = ref(false);

const isLoading = computed(() => {
  return !isMounted.value || isPaginationFetch.value;
});

const sort = ref<ColumnSort>({
  id: "lastUserAccess",
  desc: true,
});

const debounceUserFetch = useDebounceFn(() => {
  userStore.refetchData();
}, 1000);

const handleSort = (value: SortingState) => {
  let s = value[0];

  sort.value.id = s?.id || "lastUserAccess";
  sort.value.desc = s?.desc;

  userStore.updateSort(sort.value.desc ? "desc" : "asc", sort.value.id);
  debounceUserFetch();
};

onMounted(() => {
  isMounted.value = true;
  userStore.fetchData();
});
</script>

<template>
  <section class="flex-1 flex flex-col gap-5">
    <GTitlePage title="Usuários" />

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
      :pagination-query-methods="userStore"
      :is-pagination-fetch="isLoading"
      total-label="Usuários"
      using-store
    />
  </section>
</template>
