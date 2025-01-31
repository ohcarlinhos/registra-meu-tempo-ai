<script lang="ts" setup>
const emit = defineEmits(["update:page", "update:perPage"]);

const props = defineProps<{
  totalItems?: number;
  totalPages?: number;
  page?: number;
  perPage?: number;
  perPageList?: number[];
  isFetch?: boolean;

  usingStore?: boolean;
  fetchData?: () => Promise<void>;
  paginationQuery?: IPaginationQuery;
  isPaginationFetch?: boolean;
}>();

const computedPage = computed({
  get: () => {
    return props.page || 1;
  },
  set: (page: number) => {
    if (page == props.page) return;

    if (props.usingStore && props.paginationQuery && props.fetchData) {
      props.paginationQuery.page = page;
      props.fetchData();
    } else {
      emit("update:page", page);
    }
  },
});

watch(
  () => props.totalPages,
  (newTotalPages) => {
    if (newTotalPages && computedPage.value > newTotalPages) {
      computedPage.value = newTotalPages;
    }
  }
);

const computedPerPage = computed({
  get: () => {
    return props.perPage || computedList.value[0];
  },
  set: (perPage: number) => {
    if (perPage == props.perPage) return;

    if (props.usingStore && props.paginationQuery && props.fetchData) {
      props.paginationQuery.perPage = perPage;
      props.fetchData();
    } else {
      emit("update:perPage", perPage);
    }
  },
});

watch(
  () => props.totalItems,
  (newTotalItems) => {
    if (newTotalItems && computedPerPage.value > newTotalItems) {
      computedPerPage.value =
        computedPerPageList.value.reverse().find((i) => i <= newTotalItems) ||
        10;
    }
  }
);

const computedList = computed(() => {
  return props.perPageList || [10, 20, 30];
});

const computedPerPageList = computed(() => {
  return computedList.value.filter(
    (item, index) =>
      (props.totalItems || 0) >= item ||
      (props.totalItems || 0) > computedList.value[index - 1]
  );
});
</script>

<template>
  <div class="flex justify-between items-center mt-3">
    <UBadge v-if="$props.totalItems" size="lg" color="white" variant="solid">
      Total: {{ $props.totalItems }}
    </UBadge>

    <UPagination
      v-if="totalPages && totalItems && totalItems > computedList[0]"
      v-model="computedPage"
      :page-count="perPage"
      :total="totalItems"
      :disabled="isPaginationFetch || isFetch"
    />

    <section v-if="computedPerPageList.length" class="flex items-center gap-2">
      <USelect
        v-model="computedPerPage"
        :options="computedPerPageList"
        :disabled="isPaginationFetch || isFetch"
      />
    </section>
  </div>
</template>
