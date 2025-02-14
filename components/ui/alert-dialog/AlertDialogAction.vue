<script setup lang="ts">
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertDialogAction, type AlertDialogActionProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { LoaderCircle } from "lucide-vue-next";

const props = defineProps<
  AlertDialogActionProps & {
    class?: HTMLAttributes["class"];
    loading?: boolean;
  }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AlertDialogAction
    v-bind="delegatedProps"
    :class="cn(buttonVariants(), props.class)"
  >
    <section class="relative w-full">
      <section
        v-if="loading"
        class="absolute w-full flex justify-center pt-[2px]"
      >
        <component class="animate-spin self-center" :is="LoaderCircle" />
      </section>

      <section
        class="inline-flex items-center justify-center gap-2 whitespace-nowrap"
        :class="loading && 'opacity-0'"
      >
        <slot />
      </section>
    </section>
  </AlertDialogAction>
</template>
