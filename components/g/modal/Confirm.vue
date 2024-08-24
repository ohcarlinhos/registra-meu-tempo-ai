<script lang="ts" setup>
const props = defineProps<{
  open: boolean;
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  customWidth?: string;
  isFetch?: boolean;
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
      <h3 class="text-xl pb-3">{{ title }}</h3>

      <p v-if="text">
        {{ text }}
      </p>

      <template #footer>
        <div class="grid grid-cols-2 gap-5">
          <UButton
            color="blue"
            block
            :disabled="isFetch"
            :label="props.cancelText ? props.cancelText : $t('cancel')"
            @click="emit('cancel')"
          />

          <UButton
            block
            :loading="isFetch"
            :label="props.confirmText ? props.confirmText : $t('confirm')"
            @click="emit('confirm')"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
