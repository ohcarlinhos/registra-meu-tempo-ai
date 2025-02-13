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
  isPaginationFetch?: boolean;

  paginationQuery?: IPaginationQuery;
  paginationQueryMethods?: IPaginationQueryMethods;

  totalLabel?: string;
}>();

const computedPage = computed({
  get: () => {
    return props.page || 1;
  },
  set: (page: number) => {
    if (page == props.page) return;

    if (props.usingStore) {
      props.paginationQueryMethods?.setPage(page);
      props.paginationQueryMethods?.fetchData();
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
    return (props.perPage || computedList.value[0]).toString();
  },
  set: (perPage: string) => {
    if (parseInt(perPage) == props.perPage) return;

    if (props.usingStore) {
      props.paginationQueryMethods?.setPerPage(perPage);
      props.paginationQueryMethods?.fetchData();
    } else {
      emit("update:perPage", perPage);
    }
  },
});

watch(
  () => props.totalItems,
  (newTotalItems) => {
    if (newTotalItems && parseInt(computedPerPage.value) > newTotalItems) {
      computedPerPage.value = (
        computedPerPageList.value.reverse().find((i) => i <= newTotalItems) ||
        10
      ).toString();
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
  <div
    class="flex justify-between items-center mt-3 flex-col md:flex-row gap-5"
  >
    <Pagination
      v-if="totalPages && totalItems && totalItems > computedList[0]"
      v-slot="{ page }"
      v-model:page="computedPage"
      :total="totalItems"
      :items-per-page="perPage"
      show-edges
    >
      <PaginationList
        :key="totalItems"
        v-slot="{ items }"
        class="flex items-center gap-1"
      >
        <PaginationFirst />
        <PaginationPrev />

        <template v-for="(item, index) in items">
          <PaginationListItem
            v-if="item.type === 'page'"
            :key="index"
            :value="item.value"
            as-child
          >
            <Button
              class="w-10 h-10 p-0"
              size="icon"
              :variant="item.value === page ? 'default' : 'outline'"
            >
              {{ item.value }}
            </Button>
          </PaginationListItem>

          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext />
        <PaginationLast />
      </PaginationList>
    </Pagination>

    <section v-if="computedPerPageList.length" class="flex items-center gap-5">
      <section v-if="$props.totalItems">
        Total de {{ $props.totalItems }} {{ totalLabel || "itens" }}
      </section>
      <section class="w-[80px]">
        <Select
          v-model="computedPerPage"
          :disabled="isPaginationFetch || isFetch"
        >
          <SelectTrigger>
            <SelectValue
              :placeholder="(totalLabel || 'Itens') + ' por página'"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Por página</SelectLabel>
              <SelectItem
                v-for="item in computedPerPageList"
                :value="item.toString()"
              >
                {{ item }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
    </section>
  </div>
</template>
