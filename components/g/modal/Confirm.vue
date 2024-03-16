<script lang="ts" setup>
const props = defineProps<{
  open: boolean;
  text: string;
}>();

const emit = defineEmits(["update:open", "confirm", "cancel"]);

const isOpen = computed({
  get: () => {
    return props.open;
  },
  set: (value: boolean) => {
    emit("update:open", value);
  },
});
</script>

<template>
  <UModal
    v-model="isOpen"
    prevent-close
    :ui="{
      width: 'sm:w-72',
    }"
  >
    <UCard>
      {{ text }}

      <template #footer>
        <div class="grid grid-cols-2 gap-5">
          <UButton
            color="blue"
            block
            label="Cancelar"
            @click="emit('cancel')"
          />

          <UButton block label="Confirmar" @click="emit('confirm')" />
        </div>
        <!-- <Placeholder class="h-8" /> -->
      </template>
    </UCard>
  </UModal>
</template>

<style></style>
