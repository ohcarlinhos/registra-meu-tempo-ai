<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "feedback.page",
});
useHead({ title: "Feedback e Dúvidas" });
useConfigStore().setBreadcrumbPage([{ label: "Feedback e Dúvidas" }]);
</script>

<template>
  <NuxtLayout name="panel">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-5 w-full">
      <div class="w-full col-span-1 lg:col-span-4">
        <FeedbackFormCreate :is-form="false" />
      </div>
    </div>
  </NuxtLayout>
</template>
