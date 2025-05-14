import { defineStore } from "pinia";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const useUserStore = defineStore("UserStore", () => {
  const {
    query: paginationQuery,
    setPage,
    setPerPage,
    setSearch,
    addFilter,
    removeFilter,
    updateSort,
    updatePaginationQueryWithRoute,
  } = usePaginationQuery("u_");

  const apiRes = ref<Pagination<UserMap> | null>(null);
  const isPaginationFetch = ref(false);
  const isDeleteFetch = ref(false);

  const fetchData = async (updatePaginationQuery = false) => {
    if (updatePaginationQuery) {
      updatePaginationQueryWithRoute();
    }

    isPaginationFetch.value = true;
    try {
      apiRes.value = await userApi().get(paginationQuery.value);
    } finally {
      isPaginationFetch.value = false;
    }
  };

  const refetchData = async () => {
    await fetchData(false);
  };

  const tableData = computed(() => {
    const usersTable: UserMap[] = [];

    if (apiRes.value?.data)
      apiRes.value.data.forEach((user) => {
        usersTable.push({
          ...user,
          lastUserAccess: user.lastUserAccess
            ? format(new Date(user.lastUserAccess), "dd/MM/yyyy 'às' HH:mm", {
                locale: ptBR,
              })
            : "-",
          lastUserAccessType: user.lastUserAccessType || "-",
          lastUserAccessProvider: user.lastUserAccessProvider || "-",
          createdAt: user.createdAt
            ? format(new Date(user.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                locale: ptBR,
              })
            : "-",
        });
      });

    return usersTable;
  });

  const deleteUser = async (id: number) => {
    isDeleteFetch.value = true;
    try {
      await userApi().delete(id);
      await refetchData();
    } finally {
      isDeleteFetch.value = false;
    }
  };

  const isFetch = computed(() => {
    return isDeleteFetch.value || isPaginationFetch.value;
  });

  return {
    fetchData,
    refetchData,
    paginationQuery,
    apiRes,
    isPaginationFetch,
    isFetch,
    tableData,
    setPage,
    setPerPage,
    setSearch,
    addFilter,
    removeFilter,
    updateSort,
    delete: deleteUser,
    isDeleteFetch,
  };
});
