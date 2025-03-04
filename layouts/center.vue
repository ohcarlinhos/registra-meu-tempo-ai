<script setup lang="ts"></script>

<template>
  <NuxtLayout>
    <section class="max-h-svh">
      <HomeNavbar />

      <section class="flex flex-col items-center justify-center p-4 w-full">
        <section
          class="flex flex-col items-center justify-center p-4 gap-10 w-full max-w-lg min-h-[90svh]"
        >
          <slot></slot>
          <GFooter />
        </section>
      </section>
    </section>
  </NuxtLayout>
</template>
