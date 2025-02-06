import * as jose from "jose";

export const useAuthStore = defineStore(
  "auth-store",
  () => {
    const jwt = ref<JwtData>();
    const authModal = reactive({ open: false });
    const needRefresh = ref(false);

    const { oldUserToken } = storeToRefs(useConfigStore());
    const { clearMySelf } = useUserStore();

    const isAuth = computed(() => {
      return Boolean(jwt.value?.token);
    });

    const claim = computed(() => {
      const payload = jwt.value ? jose.decodeJwt(jwt.value.token) : null;

      return {
        ...payload,
        isVerified: payload?.isVerified == "True" || false,
        name: (payload?.unique_name as string) || "-",
        email: (payload?.email as string) || "-",
      };
    });

    const setJwt = (value: JwtData) => {
      jwt.value = value;
    };

    const setExpiredToken = () => {
      if (jwt.value) jwt.value.token = oldUserToken.value;
    };

    const clearJwt = () => {
      jwt.value = undefined;
    };

    const openAuthModal = (_needRefresh = false) => {
      needRefresh.value = _needRefresh;
      authModal.open = true;
    };

    const closeAuthModal = () => {
      authModal.open = false;

      if (needRefresh.value) {
        needRefresh.value = false;
        location.reload();
      }
    };

    const clearSession = () => {
      clearJwt();
      clearMySelf();
    };

    return {
      jwt,
      authModal,
      needRefresh,
      isAuth,
      claim,
      setJwt,
      clearJwt,
      setExpiredToken,
      openAuthModal,
      closeAuthModal,
      clearSession,
    };
  },
  { persist: true }
);
