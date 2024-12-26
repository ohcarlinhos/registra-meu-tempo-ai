export const trReq = ref<TimeRecordMap>();

export const getIsFetch = ref(false);
export const actualTimeRecordId = ref<number>();

export const getTimeRecordData = async (code = "", disableFetch = false) => {
  const route = useRoute();
  const router = useRouter();

  if (code && code != route.params.code) {
    router.push({
      name: "record",
      params: {
        code,
      },
    });
    return;
  }

  if (!disableFetch) getIsFetch.value = true;

  try {
    const data = await getTimeRecordByCode(`${route.params.code}`);
    if (data) {
      trReq.value = data;
      actualTimeRecordId.value = data.id;
    }
  } catch (error) {
    ErrorToast(error);
  } finally {
    if (!disableFetch) getIsFetch.value = false;
  }
};
