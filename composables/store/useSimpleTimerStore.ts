import { defineStore } from "pinia";

type PeriodoSimpleTimerType = {
  registroId: number;
  current: PeriodoTimerType;
  fetching: boolean;
  timerDisplay: string;
};

export const useSimpleTimerStore = defineStore({
  id: "SimpleTimerStore",

  state: () => ({
    _periodosList: [] as PeriodoSimpleTimerType[],
  }),

  actions: {
    async start(registroId: number, callback: () => Promise<void>) {
      const index = this._periodosList.findIndex(
        (p) => p.registroId === registroId
      );

      if (index !== -1) {
        const periodo = this._periodosList[index];

        if (periodo.current.inicio === periodo.current.fim) {
          periodo.current.fim = Date.now();
        }

        periodo.fetching = true;

        this.savePeriodo(this._periodosList[index]).then(async () => {
          this._periodosList.splice(index, 1);
          await callback();
        });
      } else {
        const timeNow = Date.now();

        this._periodosList.push({
          registroId,
          current: { inicio: timeNow, fim: timeNow },
          fetching: false,
          timerDisplay: "00:00",
        });
      }
    },

    setFim(registroId: number) {
      const index = this._periodosList.findIndex(
        (p) => p.registroId === registroId
      );

      if (index !== -1) {
        const periodo = this._periodosList[index];
        periodo.current.fim = Date.now();
      }
    },

    savePeriodo(periodo: PeriodoSimpleTimerType) {
      return postPeriodo({
        registroId: periodo.registroId,
        inicio: new Date(periodo.current.inicio),
        fim: new Date(periodo.current.fim),
      });
    },
  },

  getters: {
    periodos(state) {
      return state._periodosList.map((p) => {
        return {
          ...p,
          timerDisplay: formatToTimerDisplay(p.current.fim - p.current.inicio),
        };
      });
    },
  },
});
