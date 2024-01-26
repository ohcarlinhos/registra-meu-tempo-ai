<script lang="ts" setup>
import { FormatedFocus } from "~/classes/FormatedFocus";

definePageMeta({
    middleware: ["auth"],
});

const tableData = reactive<{ rows: FormatedFocus[] }>({
    rows: [],
});

try {
    tableData.rows = (await getFocusList()) || [];
} catch (error) {
    useToast().add({ title: error as string, color: "red" });
}

const columns = [
    { key: "Id", label: "Id" },
    { key: "Title", label: "Título" },
    { key: "RegisterDate", label: "Data" },
    { key: "Duration", label: "Duração" },
    { key: "CategoryName", label: "Categoria" },
];
</script>

<template>
    <UContainer
        :ui="{
            padding: 'py-32',
            constrained: 'min-h-svh',
        }"
    >
        <GeneralHeader />
        <Suspense>
            <UTable
                :ui="{ base: 'bg-neutral-900 rounded-md' }"
                :columns="columns"
                :rows="tableData.rows"
            />
        </Suspense>
    </UContainer>
</template>
