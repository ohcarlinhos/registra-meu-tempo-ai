import * as jose from "jose";

export const useAuthStore = defineStore("AuthStore", {
  state: () => {
    return {
      _userToken: "",
      _openModal: false,
      _needRefreshBeforeLogin: false,
    };
  },
  actions: {
    setUserToken(token: string) {
      this._userToken = token;
    },

    clearUserToken() {
      this._userToken = "";
    },

    setOldToken() {
      this._userToken = useConfigStore().oldUserToken;
    },

    openModal(refresh = false) {
      if (refresh) this._needRefreshBeforeLogin = true;
      this._openModal = true;
    },

    closeModal() {
      this._openModal = false;
      if (this._needRefreshBeforeLogin) {
        this._needRefreshBeforeLogin = false;
        location.reload();
      }
    },
  },
  getters: {
    getUserToken: (state) => state._userToken,

    claim(state): jose.JWTPayload & { isVerified: boolean } {
      const payload = jose.decodeJwt(state._userToken);

      return {
        ...payload,
        isVerified: payload.isVerified == "True",
      };
    },

    isAuth: (state) => {
      return state._userToken != "";
    },

    needRefresh: (state) => {
      return state._needRefreshBeforeLogin;
    },
  },
  persist: true,
});
