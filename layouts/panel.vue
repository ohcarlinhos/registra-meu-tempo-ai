<template>
  <UContainer
    :ui="{
      padding: 'pt-16',
      constrained: 'w-full flex flex-col',
    }"
  >
    <GHeader small-title />
    <slot></slot>
    <GFooter class="py-10" />
  </UContainer>
</template>
