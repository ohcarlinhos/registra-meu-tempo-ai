<script lang="ts" setup>
import { NuxtLink } from "#components";
import {
  ChevronsUpDown,
  ClipboardList,
  Tag,
  Plus,
  Timer,
  MessageCircle,
} from "lucide-vue-next";

const { breadcrumbPage } = storeToRefs(useConfigStore());

const data = {
  products: [
    {
      name: "Registra meu tempo aí!",
      logo: Timer,
      type: "Ferramenta",
    },
  ],
  // documentation: [
  //   {
  //     title: "",
  //     url: "#",
  //     icon: BookOpenText,
  //     isActive: false,
  //     items: [
  //       {
  //         title: "Tarefas",
  //         name: "record.panel",
  //       },
  //       {
  //         title: "Categorias",
  //         name: "record.category",
  //       },
  //     ],
  //   },
  // ],

  pages: [
    {
      title: "Tarefas",
      name: "record.panel",
      icon: ClipboardList,
    },
    {
      title: "Cronômetros",
      name: "timer.panel",
      icon: Timer,
    },
    {
      title: "Categorias",
      name: "record.category",
      icon: Tag,
    },
    {
      title: "Enviar Feedback",
      name: "feedback.page",
      icon: MessageCircle,
    },
  ],
};

const activeProduct = ref(data.products[0]);

function setActiveProduct(team: (typeof data.products)[number]) {
  activeProduct.value = team;
}
</script>

<template>
  <NuxtLayout>
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <SidebarMenuButton
                    size="lg"
                    class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div
                      class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
                    >
                      <component :is="activeProduct.logo" class="size-4" />
                    </div>

                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-bold">
                        <span
                          class="text-transparent bg-gradient-to-r from-blue-500 to-primary bg-clip-text"
                          >{{ activeProduct.name }}</span
                        >
                      </span>
                      <span class="truncate text-xs">
                        {{ activeProduct.type }}
                      </span>
                    </div>
                    <ChevronsUpDown class="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  :side-offset="4"
                >
                  <DropdownMenuLabel class="text-xs text-muted-foreground">
                    Produtos
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    v-for="(product, index) in data.products"
                    :key="product.name"
                    class="gap-2 p-2"
                    @click="setActiveProduct(product)"
                  >
                    <div
                      class="flex size-6 items-center justify-center rounded-sm border"
                    >
                      <component :is="product.logo" class="size-4 shrink-0" />
                    </div>
                    {{ product.name }}
                    <!-- <DropdownMenuShortcut>
                      ⌘{{ index + 1 }}
                    </DropdownMenuShortcut> -->
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem class="gap-2 p-2">
                    <div
                      class="flex size-6 items-center justify-center rounded-md border bg-background"
                    >
                      <Plus class="size-4" />
                    </div>
                    <div class="font-medium text-muted-foreground">
                      Adicionar Produto
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup class="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Registro de Tempo</SidebarGroupLabel>

            <SidebarMenu>
              <SidebarMenuItem v-for="item in data.pages" :key="item.name">
                <SidebarMenuButton as-child>
                  <NuxtLink
                    :to="{ name: item.name }"
                    as="a"
                    active-class="text-primary font-bold"
                  >
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </NuxtLink>
                </SidebarMenuButton>

                <!-- <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <SidebarMenuAction show-on-hover>
                      <MoreHorizontal />
                      <span class="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    class="w-48 rounded-lg"
                    side="bottom"
                    align="end"
                  >
                    <DropdownMenuItem>
                      <Folder class="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward class="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 class="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> -->
              </SidebarMenuItem>

              <!-- <SidebarMenuItem>
              <SidebarMenuButton class="text-sidebar-foreground/70">
                <MoreHorizontal class="text-sidebar-foreground/70" />
                <span>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem> -->

              <!-- <SidebarGroup>
                <SidebarGroupLabel>Ajuda</SidebarGroupLabel>
                <SidebarMenu>
                  <Collapsible
                    v-for="item in data.documentation"
                    :key="item.title"
                    as-child
                    :default-open="item.isActive"
                    class="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger as-child>
                        <SidebarMenuButton :tooltip="item.title">
                          <component :is="item.icon" />
                          <span>{{ item.title }}</span>
                          <ChevronRight
                            class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem
                            v-for="subItem in item.items"
                            :key="subItem.title"
                          >
                            <SidebarMenuSubButton as-child>
                              <NuxtLink
                                :to="{ name: subItem.name }"
                                class="hover:text-primary hover:underline text-sm"
                                active-class="text-primary"
                              >
                                <span>{{ subItem.title }}</span>
                              </NuxtLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroup> -->

              <!-- <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <NuxtLink :to="{ name: 'feedback.page' }" as="a">
                    <component :is="MessageCircle" />
                    <span>Enviar Feedback</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem> -->
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <LayoutPanelFooter />
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header
          class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
        >
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />

            <Separator orientation="vertical" class="mr-2 h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink href="/">
                    Registra meu tempo aí!
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <template v-for="item in breadcrumbPage">
                  <BreadcrumbSeparator class="hidden md:block" />

                  <BreadcrumbItem>
                    <BreadcrumbPage v-if="item.pageName">
                      <NuxtLink :to="{ name: item.pageName }">
                        {{ item.label }}
                      </NuxtLink>
                    </BreadcrumbPage>

                    <BreadcrumbPage v-else>
                      {{ item.label }}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </template>
              </BreadcrumbList>
            </Breadcrumb>
            <!--  -->
          </div>
        </header>
        <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
          <!-- <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
        </div> -->

          <div class="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <slot></slot>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  </NuxtLayout>
</template>
