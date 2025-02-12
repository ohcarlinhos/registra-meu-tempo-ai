<script lang="ts" setup>
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
    await props.paginationQueryMethods?.fetchData();
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
  <UInput
    v-model="computedSearch"
    name="search"
    placeholder="Pesquisar"
    icon="i-icon-park-outline-search"
    autocomplete="off"
    :disabled="isPaginationFetch || isFetch"
    :loading="isPaginationFetch || isFetch"
    :ui="{ icon: { trailing: { pointer: '' } } }"
  >
    <template #trailing>
      <UButton
        v-show="computedSearch !== ''"
        color="gray"
        variant="link"
        icon="i-icon-park-outline-close-small"
        :padded="false"
        @click="computedSearch = ''"
      />
    </template>
  </UInput>
</template>
