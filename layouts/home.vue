<template>
  <NuxtLayout>
    <HomeNavbar />

    <section
      class="flex flex-col items-center justify-center py-16 px-4 gap-10"
    >
      <slot></slot>
      <GFooter />
    </section>
  </NuxtLayout>
</template>
