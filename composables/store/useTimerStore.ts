import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const useTimerStore = defineStore("TimerStore", {
  state: () => {
    return {
      _currentPeriodoList: [] as PeriodoTimerType[],
      _currentPeriodo: { inicio: 0, fim: 0 } as PeriodoTimerType,
      _registrosDeTempo: [] as IRegistroDeTempoLocal[],
      _running: false,
      _interval: null as NodeJS.Timeout | null,
      _type: "timer" as TimerType,
    };
  },

  actions: {
    reset() {
      const timeNow = Date.now();
      this._currentPeriodo.inicio = timeNow;
      this._currentPeriodo.fim = timeNow;
    },

    clearInterval() {
      clearInterval(this._interval as NodeJS.Timeout);
    },

    add(registro: IRegistroDeTempoLocal) {
      this._registrosDeTempo.push(registro);
    },

    start() {
      if (this._running === true) this.pause();

      this._interval = setInterval(() => {
        if (this._running) {
          this._currentPeriodo.fim = Date.now();
        } else {
          this.clearInterval();
        }
      }, 1000);

      this.reset();
      this._running = true;
    },

    pause() {
      this.clearInterval();

      if (this._running && this._totalMiliseconds !== 0) {
        this._currentPeriodoList.push({
          inicio: this._currentPeriodo.inicio,
          fim: this._currentPeriodo.fim,
        });
      }

      this.reset();
      this._running = false;
    },

    end() {
      if (this._running) this.pause();

      if (this._currentPeriodoList.length) {
        this.add({
          localUuid: uuidv4(),
          descricao: "",
          registroDate: new Date().toISOString(),
          periodos: this._currentPeriodoList.map((p) => ({
            inicio: new Date(p.inicio),
            fim: new Date(p.fim),
          })),
        });

        this._currentPeriodoList = [];
      }
    },

    off() {
      this._running = false;
    },

    setTimerType(type: TimerType) {
      this._type = type;
    },

    deleteRegistro(uuid: string) {
      const index = this._registrosDeTempo.findIndex(
        (r) => r.localUuid === uuid
      );

      if (index != -1) {
        this._registrosDeTempo.splice(index, 1);
      }
    },
  },

  getters: {
    isRunning(state) {
      return state._running;
    },

    timerType(state) {
      return state._type;
    },

    periodosLength(state) {
      return state._currentPeriodoList.length;
    },

    _periodosTotalSeconds(state) {
      return state._currentPeriodoList.reduce(
        (accumulator, current) => accumulator + (current.fim - current.inicio),
        0
      );
    },

    _secondsPast(state) {
      return state._currentPeriodo.fim - state._currentPeriodo.inicio;
    },

    _totalMiliseconds(): number {
      return (
        this._periodosTotalSeconds + (this._running ? this._secondsPast : 0)
      );
    },

    hasMiliseconds(): boolean {
      return this._totalMiliseconds > 0;
    },

    dontHasMiliseconds(): boolean {
      return this._totalMiliseconds === 0;
    },

    formated(): string {
      const totalSeconds = Math.floor(this._totalMiliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds - minutes * 60;
      let formated = "";

      formated += ("00" + minutes).slice(-2) + ":";
      formated += ("00" + seconds).slice(-2);

      return formated;
    },

    registros: (state) => {
      return state._registrosDeTempo
        .map((registro) => {
          return {
            ...registro,
            registroDate: format(registro.periodos[0].inicio, "dd/MM/yyyy"),
            periodos: registro.periodos.map((e) => e),
            tempoFormatado: "25m (TODO)",
          };
        })
        .reverse();
    },
  },

  persist: true,
});
