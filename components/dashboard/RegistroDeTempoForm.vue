<script lang="ts" setup>
import * as yup from "yup";
import { addHours, addMinutes } from "date-fns";

const categoriaStore = useCategoriaStore();

const emit = defineEmits(["close", "refresh"]);

const status = reactive({
  fetching: false,
});

const form = reactive<{
  titulo: string;
  dataDoRegistro: Date | string;
  categoria: string;
  periodos: { inicio: Date | string; fim: Date | string }[];
}>({
  dataDoRegistro: "",
  titulo: "",
  categoria: "",
  periodos: [],
});

// TODO: finalizar validações
const schema = yup.object({
  titulo: yup.string().required(),
  dataDoRegistro: yup.date().required(),
});

const categoriaLabel = computed({
  get: () => form.categoria,

  set: async (label) => {
    const findded = categoriaStore.categorias.find(
      (categoria) => categoria === label
    );

    if (!findded) categoriaStore.categorias.push(label);

    form.categoria = label;
  },
});

const initalMaxDate = computed(() => {
  return addMinutes(addHours(form.dataDoRegistro, 23), 59);
});

const disableAddButton = computed(() => {
  const initialValue = true;
  const allHasValue = form.periodos.reduce((acc, current) => {
    return !!current.inicio && !!current.fim && acc;
  }, initialValue);

  return !form.dataDoRegistro || allHasValue === false;
});

const addPeriodoToForm = () => {
  form.periodos.push({
    inicio: form.periodos.length == 0 ? form.dataDoRegistro : "",
    fim:
      form.periodos.length > 0
        ? addMinutes(form.periodos[form.periodos.length - 1].fim, 10)
        : "",
  });
};

const removeEventFromForm = (index: number) => {
  form.periodos.splice(index, 1);
};

const closeModal = (refresh = false) => {
  emit("close");
  if (refresh) emit("refresh");
};

// TODO: implementar envio
const submit = async () => {
  try {
    await postRegistroDeTempo(form);
    closeModal(true);
  } catch {}
};

onMounted(async () => {
  await categoriaStore.fetchCategoria();
});
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
        <UInput type="text" v-model="form.titulo" autofocus />
      </UFormGroup>

      <UFormGroup label="Categoria" name="categoria" class="z-100 relative">
        <USelectMenu
          v-model="categoriaLabel"
          :options="categoriaStore.categorias"
          :clear-search-on-close="true"
          show-create-option-when="always"
          searchable
          creatable
          :ui-menu="{
            height: 'max-h-40',
          }"
        >
          <template #option-create="{ option }">
            <span class="flex-shrink-0">Criar:</span>
            <span class="block truncate">{{ option }}</span>
          </template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup
        label="Date do Registro"
        name="data-do-registro"
        class="z-100 relative"
      >
        <GeneralDatePicker
          v-model="form.dataDoRegistro"
          class="py-1"
          disable-time-picker
        />
      </UFormGroup>

      <div class="flex justify-between pt-6">
        <h3>Períodos de Tempo</h3>

        <UButton
          label="Adicionar"
          size="sm"
          type="button"
          :disabled="disableAddButton"
          @click="addPeriodoToForm"
        />
      </div>

      <div
        v-for="(_, index) in form.periodos"
        class="flex gap-4 relative border-gray-800 border-b-2 pb-3"
      >
        <UFormGroup label="Início do período" :name="'inicio-' + index">
          <GeneralDatePicker
            v-model="form.periodos[index].inicio"
            :min="
              index == 0 ? form.dataDoRegistro : form.periodos[index - 1].fim
            "
            :max="initalMaxDate"
            class="py-1"
            @change="form.periodos[index].fim = $event"
          />
        </UFormGroup>

        <UFormGroup label="Final do período" :name="'fim-' + index">
          <GeneralDatePicker
            v-model="form.periodos[index].fim"
            class="py-1"
            :min="form.periodos[index].inicio"
            :max="addHours(initalMaxDate, 4)"
          />
        </UFormGroup>

        <UButton
          icon="i-heroicons-x-mark"
          color="white"
          variant="solid"
          @click="removeEventFromForm(index)"
        />
      </div>

      <UButton :loading="status.fetching" block type="submit" label="Enviar" />
    </UForm>
  </UCard>
</template>
