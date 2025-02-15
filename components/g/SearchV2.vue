<script lang="ts" setup>
import { Search, X, LoaderCircle } from "lucide-vue-next";

const props = defineProps<{
  usingStore?: boolean;
  isPaginationFetch?: boolean;

  paginationQuery?: IPaginationQuery;
  paginationQueryMethods?: IPaginationQueryMethods;

  isFetch?: boolean;
}>();

const debounce = ref();

const setDebounce = async (value: string) => {
  clearInterval(debounce.value);

  search.value = value;

  if (props.usingStore) {
    props.paginationQueryMethods?.setPage(1);
    props.paginationQueryMethods?.setSearch(value);
  }

  debounce.value = setTimeout(async () => {
    await props.paginationQueryMethods?.refetchData();
  }, 1000);
};

const computedSearch = computed({
  get: () => {
    return search.value;
  },
  set: async (value: string) => {
    setDebounce(value);
  },
});

const search = ref("");

if (props.paginationQuery) {
  search.value = props.paginationQuery.search;
}
</script>

<template>
  <div class="relative w-full max-w-sm items-center">
    <Input
      v-model="computedSearch"
      id="search"
      type="text"
      placeholder="Pesquisar"
      class="pl-10 pr-10"
    />
    <span
      class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
    >
      <LoaderCircle
        v-if="isPaginationFetch || isFetch"
        class="size-4 text-muted-foreground animate-spin"
      />
      <Search v-else class="size-4 text-muted-foreground" />
    </span>

    <span
      v-show="computedSearch !== ''"
      class="absolute end-0 inset-y-0 flex items-center justify-center"
    >
      <Button size="icon" variant="clean" @click="computedSearch = ''">
        <X class="size-5 text-muted-foreground" />
      </Button>
    </span>
  </div>
</template>
