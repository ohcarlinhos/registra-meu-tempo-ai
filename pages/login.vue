<script lang="ts" setup>
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
          Utilize suas credenciais, ou acesse por um provedor.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AuthFormLogin />
      </CardContent>
    </Card>
  </NuxtLayout>
</template>
