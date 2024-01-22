<script lang="ts" setup>
import { useAuthStore } from "~/store/AuthStore";
import { FormatedFocus } from "~/domain/FormatedFocus";
import type { FocusType } from "~/types/FocusType";

const userToken = useAuthStore().getUserToken;
if (!userToken) useRouter().push("/");

const tableData = reactive<{ rows: FormatedFocus[] }>({
    rows: [],
});

const getFocusList = async function () {
    const { data } = await useAsyncData("focus", () =>
        $fetch("/focus", {
            baseURL: "http://localhost:33123/api/v1",
            method: "get",
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        })
    );

    const { Data } = data.value as { Data: FocusType[] };
    tableData.rows = Data.map<FormatedFocus>(
        (i) =>
            new FormatedFocus(
                i.Id,
                i.Title,
                i.RegisterDate,
                i.Duration.InSeconds,
                i.CategoryName
            )
    );
};

await getFocusList();

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

        <UTable
            :ui="{ base: 'bg-neutral-900 rounded-md' }"
            :columns="columns"
            :rows="tableData.rows"
        />
    </UContainer>
</template>
