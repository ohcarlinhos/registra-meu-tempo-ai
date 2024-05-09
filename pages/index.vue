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
          v-if="timerStore.timeRecords.length >= 1"
          color="black"
          variant="link"
          @click="page.openTable = !page.openTable"
        >
          Você possui {{ timerStore.timeRecords.length }}
          {{
            timerStore.timeRecords.length > 1
              ? "registros locais."
              : "registro local."
          }}
          <br />(Clique para {{ page.openTable ? "fechar" : "visualizar" }})
        </UButton>
      </div>

      <UCard
        v-if="page.openTable && timerStore.timeRecords.length"
        class="mt-10"
      >
        <TimeRecordTableLocal />
      </UCard>
    </div>
  </UContainer>
</template>
