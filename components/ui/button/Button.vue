<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { Primitive, type PrimitiveProps } from "radix-vue";
import { type ButtonVariants, buttonVariants } from ".";
import { LoaderCircle } from "lucide-vue-next";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
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
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :disabled="disabled"
  >
    <section v-if="$slots['with-loading']" class="relative">
      <span v-if="loading" class="absolute -left-5 top-[2px] animate-spin">
        <component :is="LoaderCircle" />
      </span>

      <section
        class="inline-flex items-center justify-center gap-2 whitespace-nowrap"
      >
        <slot name="with-loading"></slot>
      </section>
    </section>

    <slot></slot>
  </Primitive>
</template>
