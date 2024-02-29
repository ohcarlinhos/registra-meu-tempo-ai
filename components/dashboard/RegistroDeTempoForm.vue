<script lang="ts" setup>
import * as yup from "yup";
import { computed, type PropType } from "vue";
import { subDays, subMonths } from "date-fns";
import type { DatePickerDate } from "v-calendar/dist/types/src/use/datePicker";
import type { Categoria } from "~/classes/Categoria";

const emit = defineEmits(["close"]);

const props = defineProps({
  categorias: {
    type: [Array] as PropType<Categoria[]>,
    default: () => [],
  },
});

const status = reactive({ fetching: false });

const form = reactive<{
  titulo: string;
  date: DatePickerDate | null;
  categoria: Object;
  periodos: { inicio: Date | string; fim: Date | string }[];
}>({
  date: null,
  titulo: "",
  categoria: "",
  periodos: [],
});

// TODO: finalizar validações
const schema = yup.object({
  titulo: yup.string().required(),
  dataDeRegistro: yup.date().required(),
});

const categoriaLabel = computed({
  get: () => form.categoria,
  set: async (label) => {
    form.categoria = label;
    return label;
  },
});

const addPeriodoToForm = () => {
  form.periodos.push({
    inicio: form.periodos.length == 0 ? new Date() : "",
    fim: "",
  });
};

const removeEventFromForm = (index: number) => {
  form.periodos.splice(index, 1);
};

const closeModal = () => {
  emit("close");
};

// TODO: implementar envio
const submit = () => {
  closeModal();
};
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2>Registro de Tempo</h2>

        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="closeModal"
        />
      </div>
    </template>
    <UForm :schema="schema" :state="form" @submit="submit" class="space-y-4">
      <UFormGroup label="Título" name="titulo">
        <UInput type="text" v-model="form.titulo" />
      </UFormGroup>

      <UFormGroup label="Categoria" name="categoria">
        <USelectMenu
          v-model="categoriaLabel"
          by="id"
          name="categoria"
          :options="props.categorias"
          option-attribute="nome"
          searchable
          creatable
          placeholder="Selecionar Categoria"
        >
          <template #option-create="{ option }">
            <span class="flex-shrink-0">Nova Categoria:</span>
            <span class="block truncate">{{ option }}</span>
          </template>
        </USelectMenu>
      </UFormGroup>

      <div class="flex justify-between pt-6">
        <h3>Perídos de Tempo</h3>

        <UButton
          label="Adicionar"
          size="sm"
          type="button"
          @click="addPeriodoToForm"
        />
      </div>

      <div
        v-for="(event, index) in form.periodos"
        class="grid grid-cols-2 justify-stretch gap-5 pr-10 relative border-gray-800 border-b-2 pb-2"
      >
        <UButton
          icon="i-heroicons-x-mark"
          color="gray"
          variant="ghost"
          :ui="{ base: 'absolute right-0 top-6' }"
          @click="removeEventFromForm(index)"
        />

        <UFormGroup label="Início do período" :name="'inicio-' + index">
          <GeneralDatePicker
            v-model="form.periodos[index].inicio"
            class="py-1"
            :min="
              index != 0
                ? form.periodos[index - 1].fim
                : subMonths(new Date(), 6)
            "
          />
        </UFormGroup>

        <UFormGroup label="Final do período" :name="'fim-' + index">
          <GeneralDatePicker
            v-model="form.periodos[index].fim"
            class="py-1"
            :min="form.periodos[index].inicio"
          />
        </UFormGroup>
      </div>

      <UButton :loading="status.fetching" block type="submit" label="Enviar" />
    </UForm>
  </UCard>
</template>
