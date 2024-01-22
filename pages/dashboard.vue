<script lang="ts" setup>
const columns = [
    {
        key: "Id",
        label: "Id",
    },
    {
        key: "Title",
        label: "Título",
    },
    {
        key: "RegisterDate",
        label: "Data",
    },
    {
        key: "Duration",
        label: "Duração",
    },
    {
        key: "CategoryName",
        label: "Categoria",
    },
];
const focus = [
    {
        Id: 1,
        Title: "Estudar C#",
        RegisterDate: new Date(),
        Duration: "30m 20s",
        CategoryName: "Estudo",
    },
    {
        Id: 2,
        Title: "Estudar C#",
        RegisterDate: new Date(),
        Duration: "30m 20s",
        CategoryName: "Estudo",
    },
    {
        Id: 3,
        Title: "Estudar C#",
        RegisterDate: new Date(),
        Duration: "30m 20s",
        CategoryName: "Estudo",
    },
    {
        Id: 4,
        Title: "Estudar C#",
        RegisterDate: new Date(),
        Duration: "30m 20s",
        CategoryName: "Estudo",
    },
    {
        Id: 5,
        Title: "Estudar C#",
        RegisterDate: new Date(),
        Duration: "30m 20s",
        CategoryName: "Estudo",
    },
];
</script>

<template>
    <UContainer
        :ui="{
            padding: 'pt-32',
            constrained: 'min-h-svh',
        }"
    >
        <GeneralHeader />

        <UTable
            :ui="{ base: 'bg-neutral-900 rounded-md' }"
            :columns="columns"
            :rows="focus"
        />
    </UContainer>
</template>
