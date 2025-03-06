<template>
  <section class="w-full grid grid-cols-4 items-start gap-4 md:gap-4">
    <section class="col-span-full">
      <Skeleton class="h-8 w-32" />
    </section>

    <Skeleton
      class="h-44 col-span-full lg:col-span-2 lg:row-span-2 lg:h-full flex items-center justify-center"
    />

    <Skeleton class="h-44 col-span-2 lg:col-span-1" />
    <Skeleton class="h-44 col-span-2 lg:col-span-1" />
    <Skeleton class="h-44 col-span-2 lg:col-span-1" />
    <Skeleton class="h-44 col-span-2 lg:col-span-1" />

    <section class="col-span-full">
      <Skeleton class="h-8 w-44 mt-8" />
    </section>

    <Skeleton class="h-44 col-span-full lg:col-span-1" />
    <Skeleton class="h-44 col-span-full lg:col-span-1" />
    <Skeleton class="h-44 col-span-full lg:col-span-1" />
  </section>
</template>
