<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "dashboard" });
useRouter().push({ name: "statistic.day" });
</script>
