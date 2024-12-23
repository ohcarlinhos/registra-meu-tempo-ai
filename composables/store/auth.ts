import * as jose from "jose";

export const useAuthStoreV2 = defineStore(
  "auth-store",
  () => {
    const userToken = ref("");
    const authModal = reactive({ open: false });
    const needRefresh = ref(false);

    const { clearMySelf } = useUserStore();

    const isAuth = computed(() => {
      return userToken.value != "";
    });

    const claim = computed(() => {
      const payload = userToken.value ? jose.decodeJwt(userToken.value) : null;

      return {
        ...payload,
        isVerified: payload?.isVerified == "True" || false,
      };
    });

    const setUserToken = (token: string) => {
      userToken.value = token;
    };

    const setExpiredToken = () => {
      userToken.value = useConfigStore().oldUserToken;
    };

    const clearUserToken = () => {
      userToken.value = "";
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
      clearUserToken();
      clearMySelf();
    };

    return {
      userToken,
      authModal,
      needRefresh,
      isAuth,
      claim,
      setUserToken,
      clearUserToken,
      setExpiredToken,
      openAuthModal,
      closeAuthModal,
      clearSession,
    };
  },
  { persist: true }
);
