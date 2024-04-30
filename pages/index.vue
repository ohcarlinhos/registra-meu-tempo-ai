<script lang="ts" setup>
const timerStore = useTimerStore();

const page = reactive({
  openTable: false,
});
</script>

<template>
  <UContainer
    :ui="{
      base: 'flex flex-row items-center py-12',
      constrained: 'min-h-svh max-w-xl',
    }"
  >
    <div class="flex flex-col flex-1">
      <div class="flex flex-col items-center gap-10">
        <GHeader center small-title hide-description disable-padding />

        <TimerDefault />

        <UButton
          v-if="timerStore.registros.length >= 1"
          color="black"
          variant="link"
          @click="page.openTable = !page.openTable"
        >
          Você possui {{ timerStore.registros.length }} registros locais.
          <br />(Clique para {{ page.openTable ? "fechar" : "visualizar" }})
        </UButton>
      </div>

      <UCard v-if="page.openTable && timerStore.registros.length" class="mt-10">
        <RegistroTableLocal />
      </UCard>
    </div>
  </UContainer>
</template>
