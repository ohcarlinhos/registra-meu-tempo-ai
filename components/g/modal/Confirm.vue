<script lang="ts" setup>
const props = defineProps<{
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  customWidth?: string;
  isFetch?: boolean;
  disableConfirm?: boolean;
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
  <AlertDialog v-bind:open="isOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>

        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <slot></slot>

      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isFetch" @click="emit('cancel')">
          {{ props.cancelText ? props.cancelText : $t("cancel") }}
        </AlertDialogCancel>

        <AlertDialogAction
          :disabled="isFetch || disableConfirm"
          :loading="isFetch"
          @click="emit('confirm')"
        >
          {{ props.confirmText ? props.confirmText : $t("confirm") }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
