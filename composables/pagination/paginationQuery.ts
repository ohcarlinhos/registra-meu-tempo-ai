export const usePaginationQuery = (
  prefix: string,
  defaultPerPage = 12,
  queryCopy?: ICopyPaginationQuery
) => {
  const route = useRoute();
  const router = useRouter();

  const _page = ref(queryCopy?.page || 1);
  const _perPage = ref(queryCopy?.perPage || 12);
  const _search = ref<string>(queryCopy?.search || "");
  const _filters = ref<PaginationQueryFilter[]>(
    queryCopy?.filters?.length ? queryCopy?.filters : []
  );
  const _sort = ref<"asc" | "desc">(queryCopy?.sort || "asc");
  const _sortProp = ref<string>(queryCopy?.sortProp || "");

  const _defaultPerPage = defaultPerPage;

  const page = computed(() => _page.value);
  const perPage = computed(() => _perPage.value);
  const search = computed(() => _search.value);
  const sort = computed(() => _sort.value);
  const sortProp = computed(() => _sortProp.value);
  const filters = computed(() => _filters.value);

  const setPage = (value?: number | string, skipRouterAction = false) => {
    if (typeof value === "string") value = parseInt(value);
    if (!value || value < 1) _page.value = 1;
    else _page.value = value;

    if (skipRouterAction) return;

    router.push({
      query: {
        ...useRoute().query,
        [prefix + "page"]: _page.value,
      },
    });
  };

  const setPerPage = (value?: number | string, skipRouterAction = false) => {
    if (typeof value === "string") value = parseInt(value);
    if (!value || value < 1) _perPage.value = _defaultPerPage;
    else _perPage.value = value;

    if (skipRouterAction) return;

    router.push({
      query: {
        ...useRoute().query,
        [prefix + "perPage"]: _perPage.value,
      },
    });
  };

  const setSearch = (value?: string, skipRouterAction = false) => {
    if (!value) _search.value = "";
    else _search.value = value;

    if (skipRouterAction) return;

    router.push({
      query: {
        ...useRoute().query,
        [prefix + "search"]: _search.value,
      },
    });
  };

  const setSort = (value?: string, skipRouterAction = false) => {
    if (value && ["asc", "desc"].includes(value)) {
      _sort.value = value as "asc" | "desc";
    } else {
      _sort.value = "asc";
    }

    if (skipRouterAction) return;

    router.push({
      query: {
        ...useRoute().query,
        [prefix + "sort"]: _sort.value,
      },
    });
  };

  const setSortProp = (value?: string, skipRouterAction = false) => {
    if (!value) _sortProp.value = "";
    else _sortProp.value = value;

    if (skipRouterAction) return;

    router.push({
      query: {
        ...useRoute().query,
        [prefix + "sortProp"]: _sortProp.value,
      },
    });
  };

  const setFilters = (
    filters: PaginationQueryFilter[] = [],
    skipRouterAction = false
  ) => {
    _filters.value = filters;

    if (skipRouterAction) return;

    router.push({
      query: {
        ...useRoute().query,
        [prefix + "filters"]: _filters.value.map((i) => i.tag + "::" + i.value),
      },
    });
  };

  function addFilter(filter: PaginationQueryFilter) {
    var newFilters = _filters.value.filter((e) => e.tag != filter.tag);
    if (filter.value) newFilters.push(filter);

    setFilters(newFilters);
  }

  function removeFilter(tag: string) {
    setFilters(_filters.value.filter((e) => e.tag != tag));
  }

  function updateSort(direction: string = "asc", prop: string = "") {
    setSort(direction, true);
    setSortProp(prop, true);

    const query = {
      ...useRoute().query,
    };

    if (_sort.value) {
      query[prefix + "sort"] = _sort.value;
    }

    if (_sortProp.value) {
      query[prefix + "sortProp"] = _sortProp.value;
    }

    router.push({ query });
  }

  const updatePaginationQueryWithRoute = () => {
    const routePage = route.query[prefix + "page"];
    if (routePage) {
      setPage(`${routePage}`, true);
    }

    const routePerPage = route.query[prefix + "perPage"];
    if (routePerPage) {
      setPerPage(`${routePerPage}`, true);
    }

    const routeSearch = route.query[prefix + "search"];
    if (routeSearch) {
      setSearch(`${routeSearch}`, true);
    }

    const routeSort = route.query[prefix + "sort"];
    if (routeSort) {
      setSort(`${routeSort}`, true);
    }

    const routeSortProp = route.query[prefix + "sortProp"];
    if (routeSortProp) {
      setSortProp(`${routeSortProp}`, true);
    }

    const routeFilters = route.query[prefix + "filters"];
    if (Array.isArray(routeFilters)) {
      const filters =
        routeFilters?.map((i) => {
          const keyValue = i?.split("::") || [];

          if (keyValue[0] && keyValue[1]) {
            return {
              tag: keyValue[0],
              value: keyValue[1],
            };
          }

          return {
            tag: "",
            value: "",
          };
        }) || [];

      setFilters(filters, true);
    } else if (routeFilters) {
      const keyValue = routeFilters?.split("::") || [];

      if (keyValue[0] && keyValue[1]) {
        setFilters(
          [
            {
              tag: keyValue[0],
              value: keyValue[1],
            },
          ],
          true
        );
      }
    }
  };

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

  updatePaginationQueryWithRoute();

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
    updatePaginationQueryWithRoute,
  };
};
