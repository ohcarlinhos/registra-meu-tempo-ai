export const trReq = ref<TimeRecordMap>();

export const getIsFetch = ref(false);

export const getTimeRecordData = async (code = "", disableFetch = false) => {
  const route = useRoute();
  const router = useRouter();

  if (code && code != route.params.code) {
    router.push({
      name: "time.record.page",
      params: {
        code,
      },
    });
    return;
  }

  if (!disableFetch) getIsFetch.value = true;

  try {
    const data = await getTimeRecordByCode(`${route.params.code}`, true);
    if (data) trReq.value = data;
  } catch (error) {
    ErrorToast(error);
  } finally {
    if (!disableFetch) getIsFetch.value = false;
  }
};
