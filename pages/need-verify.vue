<script lang="ts" setup>
definePageMeta({
  middleware: [
    "disabled",
    //"auth"
  ],
  name: "need.verify",
});
useHead({ title: "Você precisa verificar sua conta!" });
const router = useRouter();

const verifyEmail = () => {
  router.push({ name: "verify.page" });
};
</script>

<template>
  <NuxtLayout>
    <Dialog default-open>
      <DialogContent hide-close>
        <DialogHeader>
          <DialogTitle>
            {{ "Usuário não verificado!" }}
          </DialogTitle>

          <DialogDescription>
            Para utilizar nossa ferramenta, é necessário verificar seu usuário.
          </DialogDescription>

          <section class="flex flex-col gap-2 mt-5">
            <Button @click="verifyEmail">Verificar com e-mail</Button>
            <Button variant="outline" @click="logout">Sair</Button>
          </section>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </NuxtLayout>
</template>
