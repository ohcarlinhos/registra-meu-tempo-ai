export const usePaginationQuery = (queryCopy?: IPaginationQuery) => {
  const route = useRoute();
  const router = useRouter();

  const _page = ref(1);
  const _perPage = ref(queryCopy?.perPage || 10);
  const _search = ref<string>(queryCopy?.search || "");
  const _filters = ref<PaginationQueryFilter[]>(
    queryCopy?.filters?.length ? queryCopy?.filters : []
  );
  const _sort = ref<"asc" | "desc">(queryCopy?.sort || "asc");
  const _sortProp = ref<string>(queryCopy?.sortProp || "");

  const _defaultPerPage = 10;

  const updateRouteQuery = () => {
    router.replace({
      query: {
        ...route.query,
        page: _page.value,
        perPage: _perPage.value,
        search: _search.value,
      },
    });
  };

  const page = computed(() => {
    return _page.value;
  });

  const setPage = (value?: number | string) => {
    if (typeof value === "string") value = parseInt(value);
    if (!value || value < 1) _page.value = 1;
    else _page.value = value;
    updateRouteQuery();
  };

  const perPage = computed(() => {
    return _perPage.value;
  });

  const setPerPage = (value?: number | string) => {
    if (typeof value === "string") value = parseInt(value);
    if (!value || value < 1) _perPage.value = _defaultPerPage;
    else _perPage.value = value;
    updateRouteQuery();
  };

  const search = computed(() => {
    return _search.value;
  });

  const setSearch = (value: string) => {
    if (!value) _search.value = "";
    else _search.value = value;
    updateRouteQuery();
  };

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

  const routePage = route.query["page"];
  if (routePage) {
    setPage(`${routePage}`);
  }

  const routePerPage = route.query["perPage"];
  if (routePerPage) {
    setPerPage(`${routePerPage}`);
  }

  const routeSearch = route.query["search"];
  if (routeSearch) {
    setSearch(`${routeSearch}`);
  }

  const query = computed(() => {
    return {
      page: page.value,
      perPage: perPage.value,
      search: search.value,
      filters: filters.value,
      sort: sort.value,
      sortProp: sortProp.value,
    };
  });

  return {
    query,
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    filters,
    sort,
    sortProp,
    addFilter,
    removeFilter,
    updateSort,
    updateRouteQuery,
  };
};
