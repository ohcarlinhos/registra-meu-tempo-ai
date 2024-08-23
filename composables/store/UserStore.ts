import { defineStore } from "pinia";

export const useUserStore = defineStore("UserStore", {
  state: () => ({
    _myself: {} as UserMap,
    _fetching: false,
  }),

  actions: {
    async fetchMyself(
      callback: (data: UserMap) => void = () => {},
      mounted = false
    ) {
      try {
        this._fetching = true;
        const data = await getMyself(mounted);
        if (data) {
          this._myself = data;
          callback(data);
        }
      } catch (error) {
        ErrorToast(error);
      } finally {
        this._fetching = false;
      }
    },
  },

  getters: {
    myself(state) {
      return state._myself;
    },
  },
});
