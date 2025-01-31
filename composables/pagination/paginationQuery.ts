export const usePaginationQuery = () => {
  const _page = ref(1);
  const _perPage = ref(10);
  const _search = ref<string>("");
  const _filters = ref<PaginationQueryFilter[]>([]);
  const _sort = ref<"asc" | "desc">("asc");
  const _sortProp = ref<string>("");

  const _defaultPerPage = 10;

  const page = computed({
    get: () => _page.value,
    set: (value?: number | string) => {
      if (typeof value === "string") value = parseInt(value);
      if (!value || value < 1) _page.value = 1;
      else _page.value = value;
    },
  });

  const perPage = computed({
    get: () => _perPage.value,
    set: (value?: number | string) => {
      if (typeof value === "string") value = parseInt(value);
      if (!value || value < 1) _perPage.value = _defaultPerPage;
      else _perPage.value = value;
    },
  });

  const search = computed({
    get: () => _search.value,
    set: (value: string) => {
      if (!value) _search.value = "";
      else _search.value = value;
    },
  });

  const filters = computed({ get: () => _filters.value, set: () => {} });
  const sort = computed({ get: () => _sort.value, set: () => {} });
  const sortProp = computed({ get: () => _sortProp.value, set: () => {} });

  function addFilter(filter: PaginationQueryFilter) {
    _filters.value = _filters.value.filter((e) => e.tag != filter.tag);
    if (filter.value) _filters.value.push(filter);
  }

  function removeFilter(tag: string) {
    _filters.value = _filters.value.filter((e) => e.tag != tag);
  }

  function updateSort(direction: "asc" | "desc" = "asc", prop: string = "") {
    _sort.value = direction;
    _sortProp.value = prop;
  }

  return {
    page,
    perPage,
    search,
    filters,
    sort,
    sortProp,
    addFilter,
    removeFilter,
    updateSort,
  };
};
