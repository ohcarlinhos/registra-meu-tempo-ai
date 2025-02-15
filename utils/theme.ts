export const isDark = computed(() => {
  const colorMode = useColorMode();
  return colorMode && colorMode.value === "dark";
});

export const toggleDark = () => {
  const colorMode = useColorMode();
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
