import { format } from "date-fns";

export const useRegistroDeTempoStore = defineStore("RegistroDeTempoStore", {
  state: () => {
    return {
      registrosDeTempo: [] as RegistroDeTempoType[],
      fetchingRegistros: false,
      deletingRegistro: false,
    };
  },

  actions: {
    async fetchRegistrosDeTempo() {
      try {
        this.fetchingRegistros = true;
        const data = await getRegistrosDeTempo();

        data.value.forEach((registro) => {
          registro.dataDoRegistro = format(
            registro.dataDoRegistro,
            "dd/MM/yyyy"
          );

          if (!registro.nomeDaCategoria) registro.nomeDaCategoria = "-";
          if (!registro.tempoFormatado) registro.tempoFormatado = "Nenhum";

          registro.periodosCountText = formatPeriodosLabel(
            registro.periodosCount!
          );
        });

        this.registrosDeTempo = data.value;
      } catch (error) {
        ErrorToast(error);
      } finally {
        this.fetchingRegistros = false;
      }
    },

    async deleteRegistro(id: number) {
      try {
        this.deletingRegistro = true;
        await deleteRegistroDeTempo(id);
        await this.fetchRegistrosDeTempo();
      } finally {
        this.deletingRegistro = false;
      }
    },
  },

  getters: {
    getRegistrosDeTempo: (state) => state.registrosDeTempo,
    fetching: (state) => state.fetchingRegistros || state.deletingRegistro,
  },

  persist: false,
});
