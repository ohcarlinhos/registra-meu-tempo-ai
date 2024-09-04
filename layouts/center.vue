<template>
  <UContainer
    :ui="{
      padding: 'flex flex-col items-center justify-center py-10 gap-10',
      constrained: 'max-w-md w-full min-h-svh',
    }"
  >
    <GHeader center small-title disable-padding />
    <slot></slot>
    <GFooter />
  </UContainer>
</template>
