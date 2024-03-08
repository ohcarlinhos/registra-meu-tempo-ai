import { format } from "date-fns";

type PeriodoTimerType = {
  inicio: number;
  fim: number;
};

export const useTimerStore = defineStore("TimerStore", {
  state: () => {
    return {
      currentPeriodoList: [] as PeriodoTimerType[],
      currentPeriodo: { inicio: 0, fim: 0 } as PeriodoTimerType,
      registrosDeTempo: [] as RegistroDeTempoType[],
      running: false,
      interval: null as NodeJS.Timeout | null,
    };
  },

  actions: {
    reset() {
      const timeNow = Date.now();
      this.currentPeriodo.inicio = timeNow;
      this.currentPeriodo.fim = timeNow;
    },

    clearInterval() {
      clearInterval(this.interval as NodeJS.Timeout);
    },

    add(registro: RegistroDeTempoType) {
      this.registrosDeTempo.push(registro);
    },

    async postRegistroDeTempo(registro: RegistroDeTempoType) {
      // remover registro da lista e submeter registro específico.
    },

    start() {
      if (this.running === true) this.pause();

      this.interval = setInterval(() => {
        if (this.running) {
          this.currentPeriodo.fim = Date.now();
        } else {
          this.clearInterval();
        }
      }, 1000);

      this.reset();
      this.running = true;
    },

    pause() {
      this.clearInterval();

      if (this.running && this.totalMiliseconds !== 0) {
        this.currentPeriodoList.push({
          inicio: this.currentPeriodo.inicio,
          fim: this.currentPeriodo.fim,
        });
      }

      this.reset();
      this.running = false;
    },

    end() {
      if (this.running) this.pause();

      if (this.currentPeriodoList.length) {
        this.add({
          titulo: "Registro local",
          dataDoRegistro: new Date().toISOString(),
          periodos: this.currentPeriodoList.map((p) => ({
            inicio: new Date(p.inicio),
            fim: new Date(p.fim),
          })),
        });

        this.currentPeriodoList = [];
      }
    },
  },

  getters: {
    periodoListTotalSeconds: (state) => {
      return state.currentPeriodoList.reduce(
        (accumulator, current) => accumulator + (current.fim - current.inicio),
        0
      );
    },

    actualPeriodoSecondsPast(state) {
      return state.currentPeriodo.fim - state.currentPeriodo.inicio;
    },

    totalMiliseconds(): number {
      return (
        this.periodoListTotalSeconds +
        (this.running ? this.actualPeriodoSecondsPast : 0)
      );
    },

    formated(): string {
      const totalSeconds = Math.floor(this.totalMiliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds - minutes * 60;
      let formated = "";

      formated += ("00" + minutes).slice(-2) + ":";
      formated += ("00" + seconds).slice(-2);

      return formated;
    },

    registrosDeTempoFormated: (state) => {
      return state.registrosDeTempo.map((r) => {
        return {
          ...r,
          dataDoRegistro: format(r.dataDoRegistro, "dd/MM/yyyy"),
        };
      });
    },
  },

  persist: true,
});
