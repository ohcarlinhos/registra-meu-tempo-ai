<script lang="ts" setup>
const props = defineProps<{
  perPage?: number;
  store: BasicStoreToPaginate;
}>();

const debounce = ref();

const setDebounce = async (value: string) => {
  clearInterval(debounce.value);

  search.value = value;
  debounce.value = setTimeout(async () => {
    await props.store.fetch(1, props.perPage, value, true);
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
    :loading="props.store.fetching"
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
