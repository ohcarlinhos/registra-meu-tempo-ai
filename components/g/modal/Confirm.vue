<script lang="ts" setup>
const props = defineProps<{
  open: boolean;
  text: string;
  confirmText?: string;
  cancelText?: string;
  customWidth?: string;
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
      width: customWidth ? customWidth : 'sm:w-72',
    }"
  >
    <UCard>
      {{ text }}

      <template #footer>
        <div class="grid grid-cols-2 gap-5">
          <UButton
            color="blue"
            block
            :label="props.cancelText ? props.cancelText : $t('g.cancel')"
            @click="emit('cancel')"
          />

          <UButton
            block
            :label="props.confirmText ? props.confirmText : $t('g.confirm')"
            @click="emit('confirm')"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
