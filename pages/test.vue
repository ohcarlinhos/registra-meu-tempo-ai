<script lang="ts" setup>
const askToAuthorizateNotification = () => {
  Notification.requestPermission((permission) => {
    if (permission === "granted") {
      setTimeout(() => {
        clickSound.play();
        new Notification("Esse é apenas um teste, sabia?", {
          body: "Corpo da notificação",
        });
      }, 3000);
    } else {
      OkToast("Ative as notificações do seu navegador.");
    }
  });
};
</script>

<template>
  <div class="p-16 w-full flex justify-center">
    <UButton @click="askToAuthorizateNotification" label="Emitir notificação" />
  </div>
</template>

<style></style>
