<script lang="ts" setup>
defineProps<{
  timePeriods: TimePeriodMap[] | TimePeriodLocal[];
  label: string;
}>();
</script>

<template>
  <section v-if="timePeriods.length === 0">
    <span>{{ label }}</span>
  </section>

  <section v-else class="flex">
    <HoverCard :open-delay="0" :close-delay="0">
      <HoverCardTrigger>
        {{ label }}
      </HoverCardTrigger>

      <HoverCardContent align="center">
        <div class="flex gap-2">
          <Badge
            v-for="timePeriod in timePeriods"
            :title="formatTimePeriodPopper(timePeriod).date"
            variant="outline"
          >
            {{ formatTimePeriodPopper(timePeriod).formatted }}
          </Badge>
        </div>
      </HoverCardContent>
    </HoverCard>
  </section>
</template>
