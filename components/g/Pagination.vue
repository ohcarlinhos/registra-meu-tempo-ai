<script lang="ts" setup>
const emit = defineEmits(["update:page", "update:perPage"]);

const props = defineProps<{
  totalItems?: number;
  totalPages?: number;
  page?: number;
  perPage?: number;
  search?: string;
  store?: BasicStoreToPaginate;
  perPageList?: number[];
}>();

const computedPage = computed({
  get: () => {
    return props.page || 1;
  },
  set: (page: number) => {
    if (props.store)
      props.store.fetch(
        parseInt(`${page}`),
        computedPerPage.value,
        props.search,
        true
      );
    else emit("update:page", parseInt(`${page}`));
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
    if (props.store)
      props.store.fetch(1, parseInt(`${perPage}`), props.search, true);
    else emit("update:perPage", parseInt(`${perPage}`));
  },
});

watch(
  () => props.totalItems,
  (newTotalItems) => {
    if (newTotalItems && computedPerPage.value > newTotalItems) {
      computedPerPage.value =
        computedPerPageList.value.reverse().find((i) => i <= newTotalItems) ||
        4;
    }
  }
);

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
        props.totalItems > computedList[0]
      "
      v-model="computedPage"
      :page-count="props.perPage"
      :total="props.totalItems"
      :disabled="store?.fetching"
      class="mt-2"
    />

    <section v-if="computedPerPageList.length" class="flex items-center gap-2">
      {{ $t("itemsPerPage") }}

      <USelect
        v-model="computedPerPage"
        :options="computedPerPageList"
        :disabled="store?.fetching"
      />
    </section>
  </div>
</template>
