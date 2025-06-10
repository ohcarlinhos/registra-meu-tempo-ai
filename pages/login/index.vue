<script lang="ts" setup>
import { _$t } from "#imports";
definePageMeta({ middleware: ["guest"], name: "login" });
useHead({ title: "Acessar ferramenta" });
</script>

<template>
  <NuxtLayout name="center">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>
          {{ _$t("access") }}
        </CardTitle>

        <CardDescription>
          Utilize um dos provedores de autenticação para acessar a ferramenta.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AuthFormLogin />
      </CardContent>
    </Card>
  </NuxtLayout>
</template>
