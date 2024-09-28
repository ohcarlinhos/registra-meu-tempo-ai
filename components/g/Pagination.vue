<script lang="ts" setup>
const emit = defineEmits(["update:page", "update:perPage"]);

const props = defineProps<{
  totalItems?: number;
  totalPages?: number;
  page?: number;
  perPage?: number;
  search?: string;
  store?: BasicStoreToPagination;
  perPageList?: number[];
}>();

const computedPage = computed({
  get: () => {
    return props.page || 1;
  },
  set: (page: number) => {
    if (page == props.page) return;

    if (props.store) {
      props.store.paginationQuery.page = page;
      props.store.fetch(true);
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

    if (props.store) {
      props.store.paginationQuery.perPage = perPage;
      props.store.fetch(true);
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
      :disabled="store?.isFetch"
      class="mt-2"
    />

    <section v-if="$props.totalItems">Total: {{ $props.totalItems }}</section>

    <section v-if="computedPerPageList.length" class="flex items-center gap-2">
      {{ $t("itemsPerPage") }}

      <USelect
        v-model="computedPerPage"
        :options="computedPerPageList"
        :disabled="store?.isFetch"
      />
    </section>
  </div>
</template>
