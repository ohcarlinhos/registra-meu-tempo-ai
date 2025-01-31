<script lang="ts" setup>
const props = defineProps<{
  fetchData?: () => Promise<void>;
  paginationQuery?: IPaginationQuery;
  isPaginationFetch?: boolean;

  isFetch?: boolean;
}>();

const debounce = ref();

const setDebounce = async (value: string) => {
  clearInterval(debounce.value);

  search.value = value;

  if (props.paginationQuery) {
    props.paginationQuery.page = 1;
    props.paginationQuery.search = value;
  }

  debounce.value = setTimeout(async () => {
    if (props.fetchData) {
      await props.fetchData();
    }
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
