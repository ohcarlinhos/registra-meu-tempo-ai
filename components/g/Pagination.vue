<script lang="ts" setup>
type StoreWithFetch = {
  fetch(
    page?: number,
    perPage?: number,
    search?: string,
    mounted?: boolean
  ): Promise<void>;
  fetching: boolean;
};

const props = defineProps<{
  totalItems?: number;
  totalPages?: number;
  page?: number;
  perPage?: number;
  search?: string;
  store: StoreWithFetch;
  perPageList?: number[];
}>();

const computedPage = computed({
  get: () => {
    return props.page || 1;
  },
  set: (page: number) => {
    props.store.fetch(page, computedPerPage.value, props.search, true);
  },
});

const computedPerPage = computed({
  get: () => {
    return props.perPage || computedList.value[0];
  },
  set: (perPage: number) => {
    props.store.fetch(1, perPage, props.search, true);
  },
});

const computedList = computed(() => {
  return props.perPageList || [4, 8, 10];
});
const computedPerPageList = computed(() => {
  return computedList.value.filter((i) => (props.totalItems || 0) >= i);
});
</script>

<template>
  <div class="flex justify-between items-end mt-3">
    <UPagination
      v-if="
        props &&
        props.totalPages &&
        props.totalItems &&
        props.totalItems >= computedList[0]
      "
      v-model="computedPage"
      :page-count="props.perPage"
      :total="props.totalItems"
      :disabled="store.fetching"
      class="mt-2"
    />

    <section v-if="computedPerPageList.length" class="flex items-center gap-2">
      {{ $t("itemsPerPage") }}

      <USelect
        v-model="computedPerPage"
        :options="computedPerPageList"
        :disabled="store.fetching"
      />
    </section>
  </div>
</template>
