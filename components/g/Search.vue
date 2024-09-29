<script lang="ts" setup>
const props = defineProps<{
  store: BasicStoreToPagination;
  isFetch?: boolean;
}>();

const debounce = ref();

const setDebounce = async (value: string) => {
  clearInterval(debounce.value);

  search.value = value;
  props.store.paginationQuery.search = value;

  debounce.value = setTimeout(async () => {
    await props.store.fetch(true);
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

if (props.store) {
  search.value = props.store.paginationQuery.search;
}
</script>

<template>
  <UInput
    v-model="computedSearch"
    name="search"
    placeholder="Pesquisar"
    icon="i-icon-park-outline-search"
    autocomplete="off"
    :disabled="props.store.isFetch || isFetch"
    :loading="props.store.isFetch || isFetch"
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
