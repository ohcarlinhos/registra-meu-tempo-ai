<template>
  <NuxtLayout>
    <UContainer
      :ui="{
        padding: 'pt-16',
        constrained: 'w-full flex flex-col',
      }"
    >
      <slot></slot>
      <GFooter class="py-10" />
    </UContainer>
  </NuxtLayout>
</template>
