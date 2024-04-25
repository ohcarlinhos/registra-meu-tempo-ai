import { format } from "date-fns";

export const useRegistroStore = defineStore("RegistroStore", {
  state: () => {
    return {
      _registros: [] as RegistroType[],
      _fetching: false,
      _deletingRegistro: false,
    };
  },

  actions: {
    async fetchRegistros() {
      try {
        this._fetching = true;
        const data = await getRegistros();
        this._registros = data.value;
      } catch (error) {
        ErrorToast(error);
      } finally {
        this._fetching = false;
      }
    },

    async deleteRegistro(id: number) {
      try {
        this._deletingRegistro = true;
        await deleteRegistro(id);
        await this.fetchRegistros();
      } finally {
        this._deletingRegistro = false;
      }
    },

    findRegistroById(id: number) {
      return this._registros.find((r) => r.id == id);
    },
  },

  getters: {
    registros: (state) => state._registros,

    registrosTableData: (state) => {
      const registrosTable: IRegistroTable[] = [];

      state._registros.forEach((registro) => {
        registrosTable.push({
          ...registro,
          registroDate:
            (registro.registroDate &&
              format(registro.registroDate, "dd/MM/yyyy")) ||
            "-",
          descricao: registro.descricao || "-",
          categoriaNome: registro.categoriaNome || "-",
          tempoFormatado: registro.tempoFormatado || "Nenhum",
          periodosCountText: periodosLabel(registro.periodosCount!),
        });
      });

      return registrosTable;
    },

    fetching: (state) => state._fetching || state._deletingRegistro,
  },

  persist: false,
});
