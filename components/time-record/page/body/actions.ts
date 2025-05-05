export const getTimeRecordQuery = () => {
  const route = useRoute();
  return useQuery({
    key: [`time-record-${route.params.code.toString()}`],
    query: () => getTimeRecordByCode(`${route.params.code}`),
    refetchOnWindowFocus: false,
  });
};
