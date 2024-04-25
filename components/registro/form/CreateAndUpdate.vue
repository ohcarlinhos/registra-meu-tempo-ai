<script lang="ts" setup>
import * as yup from "yup";
import { addMinutes } from "date-fns";

const registroStore = useRegistroStore();
const categoriaStore = useCategoriaStore();

const emit = defineEmits(["close", "refresh"]);

const props = withDefaults(
  defineProps<{
    editObject?: RegistroFormType;
  }>(),
  {}
);

/**
 * States
 */

const status = reactive({
  fetching: false,
});

const form = reactive<RegistroFormType>({
  id: undefined,
  descricao: "",
  categoria: "",
  categoriaId: undefined,
  periodos: [],
  callback: undefined,
});

const newCategorias = ref<string[]>([]);

/**
 * Validations
 */

// TODO: finalizar validações
const schema = yup.object({
  descricao: yup.string(),
});

/**
 * Computeds
 */

const categorias = computed(() => {
  return [
    ...newCategorias.value,
    ...categoriaStore.categorias.map((c) => c.nome),
  ];
});

const categoriaValue = computed({
  get: () => form.categoria,

  set: async (label) => {
    const findded = categorias.value.find((categoria) => categoria === label);
    if (!findded) newCategorias.value.push(label);

    form.categoria = label;
  },
});

const addButtonIsDisabled = computed(() => {
  const initialValue = true;

  const allHasValue = form.periodos.reduce((acc, current) => {
    return !!current.inicio && !!current.fim && acc;
  }, initialValue);

  return allHasValue === false;
});

const submitButtonIsDisabled = computed(() => {
  return form.periodos.length === 0;
});

/**
 * Methods
 */

const closeModal = (refresh = false) => {
  emit("close");
  if (refresh) registroStore.fetchRegistros();
};

const addPeriodoToForm = () => {
  const inicio =
    form.periodos.length === 0
      ? new Date()
      : addMinutes(form.periodos[form.periodos.length - 1].fim, 15);

  const fim = addMinutes(inicio, 25);

  form.periodos.push({ inicio, fim });
};

const deletePeriodoFromForm = (index: number) => {
  form.periodos.splice(index, 1);
};

const handleCategoria = async () => {
  if (newCategorias.value.length && form.categoria === newCategorias.value[0]) {
    const categoria = await postCategoria({ nome: newCategorias.value[0] });
    newCategorias.value.splice(0, 1);

    return categoria.value.id;
  }

  if (form.categoria) {
    const categoria = categoriaStore.categorias.find(
      (categoria) => categoria.nome === form.categoria
    );

    if (categoria) return categoria.id;
  }

  return undefined;
};

const submit = async () => {
  await schema.validate(await submitAction());
};

const createAction = async () => {
  try {
    await postRegistro({
      ...form,
      categoriaId: await handleCategoria(),
    });

    if (form.callback) form.callback();

    closeModal(true);
  } catch (error) {
    ErrorToast(error);
  }
};

const editAction = async (id: number) => {
  // TODO
  console.log(props.editObject);
};

const submitAction = async () => {
  return props.editObject?.id
    ? editAction(props.editObject.id)
    : createAction();
};

/**
 * Lifeclycle
 */

onMounted(async () => {
  await categoriaStore.fetchCategoria(closeModal);

  if (props.editObject) {
    form.id = props.editObject.id;
    form.descricao = props.editObject.descricao;
    form.categoria = props.editObject.categoria;
    form.categoriaId = props.editObject.categoriaId;
    form.callback = props.editObject.callback;
  } else if (form.periodos.length === 0) {
    addPeriodoToForm();
  }
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
      <UFormGroup label="Categoria" name="categoria" class="z-100 relative">
        <USelectMenu
          v-model="categoriaValue"
          :options="categorias"
          :clear-search-on-close="true"
          show-create-option-when="always"
          searchable
          creatable
          :ui-menu="{ height: 'max-h-40' }"
        >
          <template #option-create="{ option }">
            <span class="flex-shrink-0">Criar:</span>
            <span class="block truncate">{{ option }}</span>
          </template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup label="Descrição" name="descricao">
        <UInput type="text" v-model="form.descricao" autofocus />
      </UFormGroup>

      <div v-if="!editObject" class="flex justify-between pt-6">
        <h3>Períodos de Tempo</h3>

        <UButton
          label="Adicionar"
          size="sm"
          type="button"
          :disabled="addButtonIsDisabled"
          @click="addPeriodoToForm"
        />
      </div>

      <div
        v-if="!editObject"
        v-for="(_, index) in form.periodos"
        class="flex gap-4 relative border-gray-800 border-b-2 pb-3"
      >
        <UFormGroup label="Início do período" :name="'inicio-' + index">
          <GDatePicker
            v-model="form.periodos[index].inicio"
            :min="index !== 0 ? form.periodos[index - 1].fim : ''"
            class="py-1"
            @change="form.periodos[index].fim = $event"
          />
        </UFormGroup>

        <UFormGroup label="Final do período" :name="'fim-' + index">
          <GDatePicker
            v-model="form.periodos[index].fim"
            class="py-1"
            :min="form.periodos[index].inicio"
          />
        </UFormGroup>

        <UButton
          icon="i-heroicons-x-mark"
          color="white"
          variant="solid"
          @click="deletePeriodoFromForm(index)"
        />
      </div>

      <UButton
        :loading="status.fetching"
        :disabled="submitButtonIsDisabled"
        block
        type="submit"
        label="Enviar"
      />
    </UForm>
  </UCard>
</template>
