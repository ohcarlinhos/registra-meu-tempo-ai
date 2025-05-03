<script lang="ts" setup>
import { LoaderCircle } from "lucide-vue-next";

definePageMeta({
  name: "verify.page.code",
  middleware: ["disabled"],
});
useHead({ title: "Verificar conta" });

const isFetch = ref(false);

const userStore = useUserStore();
const { checkIfIsVerified } = userStore;
const { isVerified } = storeToRefs(userStore);

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await initCode();
});

const initCode = async () => {
  if (isVerified.value) {
    return router.push({ name: "record.panel" });
  }

  await verifyCode();
};

const verifyCode = async () => {
  if (!route.params.code) return;

  try {
    isFetch.value = true;

    const result = await userApi().verifyUser(route.params.code as string);
    if (!result) return;

    const isVerified = await checkIfIsVerified();
    if (!isVerified) {
      return;
    }

    OkToast(
      "Conta verificada com sucesso, por favor acesse sua conta novamente."
    );

    logout();
  } catch (err: any) {
    ErrorToast(err);

    if (
      ["recovery_code_not_found", "recovery_code_is_used_or_expired"].includes(
        err.message
      )
    ) {
      router.push({ name: "verify.page" });
    }
  } finally {
    isFetch.value = false;
  }
};
</script>

<template>
  <NuxtLayout name="center">
    <Card class="w-full">
      <CardContent>
        <section class="flex justify-center mt-5">
          <Component v-if="isFetch" class="animate-spin" :is="LoaderCircle" />
          <p v-else>Caso não seja redirecionado, atualize a tela.</p>
        </section>
      </CardContent>
    </Card>
  </NuxtLayout>
</template>
