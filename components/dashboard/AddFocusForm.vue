<script lang="ts" setup>
import * as yup from "yup";

const emit = defineEmits(["close"]);

const status = reactive({ fetching: false });
const categories = [{ id: 1, label: "study" }];
const focusEvents = [
    { label: "Início", value: "start" },
    { label: "Pausa", value: "pause" },
    { label: "Retorno", value: "continue" },
    { label: "Fim", value: "end" },
];

const form = reactive<{
    title: string;
    registerDate: string;
    category: any;
    events: { type: string; time: string }[];
}>({
    title: "",
    registerDate: "",
    category: "",
    events: [],
});

// TODO: finalizar validações
const schema = yup.object({
    title: yup.string().required(),
    registerDate: yup.date().required(),
    category: yup.object(),
});

const addEventToForm = () => {
    form.events.push({ type: "", time: "" });
};

const removeEventFromForm = (index: number) => {
    form.events.splice(index, 1);
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
                <h2>Registrar Tempo</h2>

                <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark-20-solid"
                    class="-my-1"
                    @click="closeModal"
                />
            </div>
        </template>
        <UForm
            :schema="schema"
            :state="form"
            @submit="submit"
            class="space-y-4"
        >
            <UFormGroup label="Título" name="title">
                <UInput type="text" v-model="form.title" />
            </UFormGroup>

            <UFormGroup label="Data" name="registerDate">
                <UInput type="date" v-model="form.registerDate" />
            </UFormGroup>

            <UFormGroup label="Categoria" name="category">
                <USelectMenu
                    v-model="form.category"
                    :options="categories"
                    placeholder="Selecionar Categoria"
                />
            </UFormGroup>

            <div class="flex justify-between">
                <h3>Eventos</h3>

                <UButton
                    label="Adicionar Evento"
                    size="xs"
                    type="button"
                    @click="addEventToForm"
                />
            </div>

            <div
                v-for="(event, index) in form.events"
                class="grid grid-cols-2 justify-stretch gap-5 pr-10 relative"
            >
                <UButton
                    icon="i-heroicons-x-mark"
                    color="gray"
                    variant="ghost"
                    :ui="{ base: 'absolute right-0 top-6' }"
                    @click="removeEventFromForm(index)"
                />

                <UFormGroup label="Categoria" :name="'type-' + index">
                    <USelectMenu
                        v-model="form.events[index].type"
                        :options="focusEvents"
                        placeholder="Selecionar Categoria"
                    />
                </UFormGroup>

                <UFormGroup label="Horário" :name="'hour-' + index">
                    <UInput
                        type="time"
                        v-model="form.events[index].time"
                        :min="index !== 0 ? form.events[index - 1].time : ''"
                    />
                </UFormGroup>
            </div>

            <UButton
                :loading="status.fetching"
                block
                type="submit"
                label="Enviar"
            />
        </UForm>
    </UCard>
</template>
