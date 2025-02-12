<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "feedback.page",
});
useHead({ title: "Feedback e Dúvidas" });
useConfigStore().setBreadcrumbPage([{ label: "Feedback e Dúvidas" }]);
</script>

<template>
  <NuxtLayout name="panel-v2">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-5 w-full">
      <div class="w-full col-span-1 md:col-span-6 lg:col-span-4">
        <FeedbackFormCreate :is-form="false" />
      </div>
    </div>
  </NuxtLayout>
</template>
