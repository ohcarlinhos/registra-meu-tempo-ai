export const getTimeRecordQuery = () => {
  const route = useRoute();

  const data = useQuery({
    key: [`time-record-${route.params.code.toString()}`],
    query: () => getTimeRecordByCode(`${route.params.code}`),
  });

  return { ...data };
};
