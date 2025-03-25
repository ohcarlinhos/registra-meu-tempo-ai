<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { Primitive, type PrimitiveProps } from "radix-vue";

interface Props extends PrimitiveProps {
  class?: HTMLAttributes["class"];
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  disabled: false,
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        'rounded-full bg-primary w-10 h-10 flex items-center justify-center',
        disabled && 'opacity-30 cursor-not-allowed',
        props.class
      )
    "
    :disabled="disabled"
  >
    <slot />
  </Primitive>
</template>
