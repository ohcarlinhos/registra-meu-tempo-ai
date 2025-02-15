<template>
  <NuxtLayout>
    <GFloatToggleDarkTheme />

    <section
      class="flex flex-col items-center justify-center py-16 px-4 gap-10"
    >
      <GHeader center small-title disable-padding />
      <slot></slot>
      <GFooter />
    </section>
  </NuxtLayout>
</template>
