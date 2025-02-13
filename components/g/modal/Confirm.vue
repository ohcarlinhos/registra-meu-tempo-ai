<script lang="ts" setup>
const props = defineProps<{
  open: boolean;
  title?: string;
  text?: string;
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
  <!-- TODO: trocar modal para shadcn -->
  <UModal
    v-model="isOpen"
    prevent-close
    :ui="{
      width: customWidth ? customWidth : 'sm:w-72',
    }"
  >
    <Card>
      <CardHeader>
        <CardTitle>{{ title }}</CardTitle>
        <CardDescription v-if="text">
          {{ text }}
        </CardDescription>
      </CardHeader>

      <CardContent v-if="$slots.default">
        <slot></slot>
      </CardContent>

      <CardFooter>
        <div class="w-full grid grid-cols-2 gap-5">
          <Button
            variant="destructive"
            :disabled="isFetch"
            @click="emit('cancel')"
          >
            {{ props.cancelText ? props.cancelText : $t("cancel") }}
          </Button>

          <Button :disabled="disableConfirm" @click="emit('confirm')">
            {{ props.confirmText ? props.confirmText : $t("confirm") }}
          </Button>
        </div>
      </CardFooter>
    </Card>
  </UModal>
</template>
