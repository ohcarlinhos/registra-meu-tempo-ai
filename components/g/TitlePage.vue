<template>
  <section class="col-span-full">
    <section
      class="flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-start"
    >
      <section>
        <h2 class="text-4xl font-bold flex items-center gap-5">
          {{ title }}
          <slot name="title-slot"></slot>
        </h2>

        <span v-if="description" class="text-muted-foreground">
          {{ description }}
        </span>
      </section>

      <slot></slot>
    </section>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
});
</script>
