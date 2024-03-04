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
          registro.periodosCountText =
            registro.periodosCount === 0
              ? "Nenhum"
              : registro.periodosCount +
                ` ${registro.periodosCount === 1 ? "período" : "períodos"}`;
        });

        this.registrosDeTempo = data.value;
      } catch (err) {
        console.log("deu ruim");
      } finally {
        this.fetchingRegistros = false;
      }
    },

    async deleteRegistro(id: number) {
      try {
        this.deletingRegistro = true;
        await deleteRegistroDeTempo(id);

        await this.fetchRegistrosDeTempo();
      } catch (err) {
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
