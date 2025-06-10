<template>
  <NuxtLayout>
    <HomeNavbar />

    <section class="flex flex-col py-16 gap-10">
      <slot></slot>
      <GFooter />
    </section>
  </NuxtLayout>
</template>
