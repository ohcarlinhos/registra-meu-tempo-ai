<script lang="ts" setup>
import { ref } from "vue";
import { Menu } from "lucide-vue-next";

const { loggedIn } = useUserSession();

interface RouteProps {
  name: string;
  label: string;
}

interface FeatureProps {
  title: string;
  description: string;
}

const routeList = computed<RouteProps[]>(() => {
  const routes = [];

  if (!loggedIn.value) {
    routes.push({
      name: "login",
      label: "Acessar",
    });
  } else {
    routes.unshift({
      name: "dashboard",
      label: "Dashboard",
    });
    routes.push({
      name: "logout",
      label: "Sair",
    });
  }

  return routes;
});

const isOpen = ref<boolean>(false);
</script>

<template>
  <header
    :class="{
      'shadow-light': !isDark,
      'shadow-dark': isDark,
      'w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border z-40 rounded-2xl flex justify-between items-center p-2 bg-card shadow-md': true,
    }"
  >
    <NuxtLink
      :to="{ name: 'home' }"
      class="font-bold text-lg flex items-center ml-2"
    >
      <h1
        class="text-transparent bg-gradient-to-r from-blue-500 to-primary bg-clip-text"
      >
        Registra meu tempo aí!
      </h1>
    </NuxtLink>
    <!-- Mobile -->
    <div class="flex items-center lg:hidden">
      <Sheet v-model:open="isOpen">
        <SheetTrigger as-child>
          <Menu @click="isOpen = true" class="cursor-pointer" />
        </SheetTrigger>

        <SheetContent side="left" class="flex flex-col justify-between bg-card">
          <div>
            <SheetHeader class="mb-4 ml-4">
              <SheetTitle class="flex items-center">
                <NuxtLink
                  :to="{ name: 'home' }"
                  @click="isOpen = false"
                  class="font-bold text-lg flex items-center ml-2"
                >
                  <h1
                    class="text-transparent bg-gradient-to-r from-blue-500 to-primary bg-clip-text"
                  >
                    Rmta!
                  </h1>
                </NuxtLink>
              </SheetTitle>
            </SheetHeader>

            <div class="flex flex-col gap-2">
              <Button
                v-for="{ name, label } in routeList"
                :key="label"
                as-child
                variant="ghost"
                class="justify-start text-base"
              >
                <NuxtLink
                  @click="isOpen = false"
                  :to="{ name }"
                  active-class="text-primary font-bold"
                >
                  {{ label }}
                </NuxtLink>
              </Button>
            </div>
          </div>

          <SheetFooter class="flex-col sm:flex-col justify-start items-start">
            <Separator class="mb-2" />

            <HomeToggleTheme />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>

    <!-- Desktop -->
    <NavigationMenu class="hidden lg:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Button
              v-for="{ name, label } in routeList"
              :key="label"
              as-child
              variant="ghost"
              class="justify-start text-base"
            >
              <NuxtLink :to="{ name }" active-class="text-primary font-bold">
                {{ label }}
              </NuxtLink>
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <div class="hidden lg:flex lg:min-w-[197px] justify-end">
      <div>
        <HomeToggleTheme />
      </div>
    </div>
  </header>
</template>

<style scoped>
.shadow-light {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.085);
}

.shadow-dark {
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.141);
}
</style>
