export const isDark = computed(() => {
  const colorMode = useColorMode();
  return colorMode && colorMode.value === "dark";
});
