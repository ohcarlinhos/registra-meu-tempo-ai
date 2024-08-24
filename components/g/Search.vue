<script lang="ts" setup>
const props = defineProps<{
  perPage?: number;
  store: BasicStoreToPagination;
}>();

const debounce = ref();

const setDebounce = async (value: string) => {
  clearInterval(debounce.value);

  search.value = value;

  const pagQuery = new PaginationQuery();
  pagQuery.search = value;
  pagQuery.perPage = props.perPage;

  debounce.value = setTimeout(async () => {
    await props.store.fetch(pagQuery, true);
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
</script>

<template>
  <UInput
    v-model="computedSearch"
    name="search"
    placeholder="Pesquisar"
    icon="i-icon-park-outline-search"
    autocomplete="off"
    :loading="props.store.isFetch"
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
