<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";
</script>

<template>
  <Button
    @click="toggleDark"
    size="sm"
    variant="ghost"
    class="w-full justify-start"
  >
    <div v-if="isDark" class="flex gap-2">
      <Moon class="size-5" />
      <span class="block lg:hidden"> Escuro </span>
    </div>

    <div v-else class="flex gap-2">
      <Sun class="size-5" />
      <span class="block lg:hidden">Claro</span>
    </div>

    <span class="sr-only">Mudar cor do tema</span>
  </Button>
</template>
