<script lang="ts" setup>
import { format } from "date-fns";

import {
  tpModal,
  createTimePeriod,
  editTimePeriod,
  closeTimePeriodModal,
  deleteTpModal,
  openDeleteTpModal,
  closeDeleteTpModal,
} from "./time-period/modal";

import {
  dtpReq,
  getIsFetch,
  getDatedTimeData,
  deleteTimePeriodAction,
  deleteIsFetch,
} from "./time-period/actions";

const props = defineProps<{
  timeRecordId?: number;
  isFetch?: boolean;
  callback?: () => Promise<void>;
}>();

const deleteTpAction = () => {
  return deleteTimePeriodAction(
    deleteTpModal.id,
    props.timeRecordId!,
    closeDeleteTpModal,
    props.callback
  );
};

const closeTimePeriodCallback = async (refresh = false) => {
  if (props.callback) await props.callback();

  await closeTimePeriodModal(() => getData(), refresh);
};

const getData = () => {
  return getDatedTimeData(props.timeRecordId!);
};

const isFetchNow = computed(() => {
  return getIsFetch.value || props.isFetch;
});

onMounted(async () => {
  await getData();
});

defineExpose({
  getData,
});
</script>

<template>
  <section
    class="w-full grid grid-cols-1 items-start md:grid-cols-12 gap-5 md:gap-5"
  >
    <section class="w-full md:col-span-12">
      <UContainer
        :ui="{
          base: 'flex flex-row justify-between gap-5',
          padding: 'pb-5 px-0 lg:px-0 sm:px-0',
        }"
      >
        <h2 class="text-4xl font-bold">Histórico do Registro</h2>

        <div v-if="timeRecordId" class="flex gap-5 flex-row items-start mt-1">
          <TimePeriodButtonAdd
            :time-record-id="timeRecordId"
            :disabled="isFetchNow"
            @open="createTimePeriod"
          />
        </div>
      </UContainer>
    </section>

    <section
      v-if="isFetchNow"
      class="w-full col-span-12 grid grid-cols-1 items-start md:grid-cols-12 gap-5 md:gap-5"
    >
      <USkeleton class="h-44 w-full col-span-1 md:col-span-6 lg:col-span-4" />
      <USkeleton class="h-48 w-full col-span-1 md:col-span-6 lg:col-span-4" />
      <USkeleton class="h-32 w-full col-span-1 md:col-span-6 lg:col-span-4" />
    </section>

    <UCard
      v-else
      v-for="dtp in dtpReq"
      class="w-full col-span-1 md:col-span-6 lg:col-span-4"
    >
      <h3 class="text-xl inline-flex gap-2 items-center">
        {{ format(dtp.date, "dd/MM/yyyy") }}
      </h3>

      <p class="text-md pb-1">
        <span>Total: {{ dtp.formattedTime }}</span>
      </p>

      <template v-if="dtp.timerSessions.length">
        <UDivider class="py-2" />

        <p class="text-lg">Sessões</p>

        <p class="text-sm">
          {{ dtp.timerSessionsFormattedTime }}, {{ dtp.timerSessions.length }}
          {{ dtp.timerSessions.length > 1 ? "sessões" : "sessão" }}
        </p>

        <section
          v-if="dtp.timerSessions.length"
          class="flex flex-row gap-2 flex-wrap py-2"
        >
          <UPopover
            v-for="(timerSession, index) in dtp.timerSessions"
            :key="timerSession.id"
            mode="click"
          >
            <UBadge
              :color="timerSession.type === 'timer' ? 'primary' : 'red'"
              :variant="index % 2 == 0 ? 'subtle' : 'soft'"
              size="md"
            >
              {{ timerSession.formattedTime || "0s" }}
            </UBadge>

            <template #panel>
              <div class="p-2 pt-1 flex flex-col items-center gap-2">
                <p class="text-sm">
                  {{
                    timerSession.type === "pomodoro" ? "Pomodoro" : "Cronômetro"
                  }}
                </p>

                <UDivider />

                <section
                  v-for="tp in timerSession.timePeriods"
                  :key="tp.id"
                  class="flex w-full justify-around gap-2"
                >
                  <UBadge
                    color="gray"
                    variant="solid"
                    :title="
                      format(tp.start, 'HH:mm:ss dd/MM/yyyy') +
                      ' até ' +
                      format(tp.end, 'HH:mm:ss dd/MM/yyyy')
                    "
                  >
                    {{ format(tp.start, "HH:mm:ss") }} até
                    {{ format(tp.end, "HH:mm:ss") }}
                  </UBadge>

                  <UBadge
                    color="yellow"
                    variant="subtle"
                    :title="tp.formattedTime"
                  >
                    {{ tp.formattedTime }}
                  </UBadge>
                </section>
              </div>
            </template>
          </UPopover>
        </section>
      </template>

      <template v-if="dtp.timePeriods.length">
        <UDivider class="py-2" />

        <p class="text-lg">Períodos</p>

        <p class="text-sm">
          {{ dtp.timePeriodsFormattedTime }}, {{ dtp.timePeriods.length }}
          {{ dtp.timePeriods.length > 1 ? "períodos" : "período" }}
        </p>

        <section class="flex flex-row gap-2 flex-wrap py-2">
          <UPopover
            v-for="(period, index) in dtp.timePeriods"
            :key="period.id"
            mode="click"
          >
            <UBadge
              color="yellow"
              :variant="index % 2 == 0 ? 'subtle' : 'soft'"
              size="md"
            >
              {{ period.formattedTime || "0s" }}
            </UBadge>

            <template #panel>
              <div class="p-2 pt-4 flex flex-col items-center gap-2">
                <section class="flex items-center gap-2">
                  <UBadge
                    color="gray"
                    variant="solid"
                    :title="format(period.start, 'HH:mm:ss dd/MM/yyyy')"
                  >
                    {{ format(period.start, "HH:mm:ss") }}
                  </UBadge>
                  até
                  <UBadge
                    color="gray"
                    variant="solid"
                    :title="format(period.end, 'HH:mm:ss dd/MM/yyyy')"
                  >
                    {{ format(period.end, "HH:mm:ss") }}
                  </UBadge>
                </section>

                <section>
                  <TimePeriodButtonEdit
                    :time-period="period"
                    @open="editTimePeriod"
                  />

                  <UButton
                    :label="_$t('delete')"
                    color="gray"
                    variant="ghost"
                    icon="i-icon-park-outline-delete-themes"
                    @click="openDeleteTpModal(period.id!)"
                  />
                </section>
              </div>
            </template>
          </UPopover>
        </section>
      </template>
    </UCard>
  </section>

  <UModal v-model="tpModal.open" prevent-close>
    <TimePeriodFormCreateAndUpdate
      :time-record-id="tpModal.timeRecordId"
      :edit-object="tpModal.form"
      @close="closeTimePeriodCallback"
    />
  </UModal>

  <GModalConfirm
    v-model:open="deleteTpModal.open"
    :isFetch="deleteIsFetch"
    :title="_$t('confirmDeleteTimePeriodMessage')"
    @confirm="deleteTpAction"
    @cancel="closeDeleteTpModal"
  />
</template>
