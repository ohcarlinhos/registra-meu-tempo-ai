import { format } from "date-fns";
import type { RegistroDeTempoType } from "../general/types/RegistroDeTempo";

export const useRegistroDeTempoStore = defineStore("RegistroDeTempoStore", {
  state: () => {
    return {
      _registrosDeTempo: [] as RegistroDeTempoType[],
      _fetchingRegistros: false,
      _deletingRegistro: false,
    };
  },

  actions: {
    async fetchRegistrosDeTempo() {
      try {
        this._fetchingRegistros = true;
        const data = await getRegistrosDeTempo();
        this._registrosDeTempo = data.value;
      } catch (error) {
        ErrorToast(error);
      } finally {
        this._fetchingRegistros = false;
      }
    },

    async deleteRegistro(id: number) {
      try {
        this._deletingRegistro = true;
        await deleteRegistroDeTempo(id);
        await this.fetchRegistrosDeTempo();
      } finally {
        this._deletingRegistro = false;
      }
    },

    findRegistroById(id: number) {
      return this._registrosDeTempo.find((r) => r.id == id);
    },
  },

  getters: {
    registrosDeTempo: (state) => state._registrosDeTempo,

    registrosDeTempoTable: (state) => {
      const registrosTable: IRegistroDeTempoTable[] = [];

      state._registrosDeTempo.forEach((registro) => {
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

    fetching: (state) => state._fetchingRegistros || state._deletingRegistro,
  },

  persist: false,
});
