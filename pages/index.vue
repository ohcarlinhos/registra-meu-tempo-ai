<script lang="ts" setup>
const store = useTimerStore();

const page = reactive({
  openTable: false,
});
</script>

<template>
  <UContainer
    :ui="{
      base: 'flex flex-row items-center',
      constrained: 'min-h-svh max-w-xl',
    }"
  >
    <div class="flex flex-col">
      <div class="flex flex-col items-start">
        <div class="flex flex-col items-center">
          <GeneralHeader />

          <UButton
            v-if="store.registrosDeTempo.length >= 2"
            color="black"
            variant="link"
            class="pb-4"
            @click="page.openTable = !page.openTable"
          >
            Você possui {{ store.registrosDeTempo.length }} registros locais.
            <br />(Clique para {{ page.openTable ? "fechar" : "visualizar" }})
          </UButton>

          <TimerDefault />
        </div>
      </div>

      <RegistroDeTempoTableLocal v-if="page.openTable" />
    </div>
  </UContainer>
</template>
