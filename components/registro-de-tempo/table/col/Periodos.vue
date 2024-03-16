<script lang="ts" setup>
import { formatPeriodoPopper } from "../../utils/formatPeriodoPopper";

defineProps<{
  periodos: PeriodoDeTempoType[];
  label: string;
}>();
</script>

<template>
  <div v-if="periodos.length === 0">
    <span>{{ label }}</span>
  </div>

  <div v-else class="flex">
    <UPopover mode="hover">
      <span>{{ label }}</span>

      <template #panel>
        <div class="p-4 flex flex-col gap-3">
          <div v-for="periodo in periodos">
            {{ formatPeriodoPopper(periodo) }}
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>
