<template>
  <section class="w-full grid grid-cols-4 items-start gap-4 md:gap-4">
    <section class="col-span-full">
      <USkeleton class="h-8 w-32" />
    </section>

    <USkeleton
      class="col-span-2 row-span-2 h-full flex items-center justify-center"
    />

    <USkeleton class="h-44" />
    <USkeleton class="h-44" />
    <USkeleton class="h-44" />
    <USkeleton class="h-44" />

    <section class="col-span-full">
      <USkeleton class="h-8 w-44 mt-8" />
    </section>

    <USkeleton class="h-44" />
    <USkeleton class="h-44" />
    <USkeleton class="h-44" />
  </section>
</template>
