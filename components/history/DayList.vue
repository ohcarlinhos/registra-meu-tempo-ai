<script lang="ts" setup>
import { Line } from "vue-chartjs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  tpModal,
  createTimePeriod,
  editTimePeriod,
  closeTimePeriodModal,
  deleteTpModal,
  openDeleteTpModal,
  closeDeleteTpModal,
  deleteTsModal,
  openDeleteTsModal,
  closeDeleteTsModal,
} from "./day-list/modal";

import {
  deleteTimePeriodAction,
  deleteTpIsFetch,
  deleteTsIsFetch,
  deleteTimerSessionAction,
} from "./day-list/actions";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Colors,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Filler,
  Colors
);

const props = defineProps<{
  timeRecordId: number;
  timeRecord?: TimeRecordMap;
  isFetch?: boolean;
  updatedOn?: Date;
  clearUpdatedOn?: () => void;
  callback?: () => Promise<void>;
}>();

const chartData = computed(() => {
  return {
    labels:
      dayStore?.apiRes?.data?.map((i) => format(i.date, "dd/MM/yyyy"), {
        locale: ptBR,
      }) || [],
    datasets: [
      {
        label: "Horas",
        data: dayStore?.apiRes?.data?.map((i) => i.timeOnHours) || [],
        borderWidth: 2,
        pointBorderWidth: 5,
        fill: true,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  scales: {
    x: {
      grid: {
        color: isDark.value ? "#262626" : "#e5e5e5",
      },
    },
    y: {
      grid: {
        color: isDark.value ? "#262626" : "#e5e5e5",
      },
    },
  },
  plugins: {
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      boxPadding: 5,
      padding: 16,
      borderWidth: 1,
      callbacks: {
        title: function (items: any) {
          return `Dia ${items[0].label}`;
        },
        label: function (tooltipItem: any) {
          const idx = tooltipItem.dataIndex;
          const value = tooltipItem.formattedValue;
          return [
            `${value} horas`,
            `(${dayStore?.apiRes?.data[idx].formattedTime})`,
          ];
        },
      },
    },
  },
}));

const dayStore = useTimeRecordHistoryStore();

const deleteTpAction = () => {
  return deleteTimePeriodAction(
    deleteTpModal.id,
    closeDeleteTpModal,
    props.callback
  );
};

const deleteTsAction = () => {
  return deleteTimerSessionAction(
    deleteTsModal.id,
    closeDeleteTsModal,
    props.callback
  );
};

const closeTimePeriodCallback = async (refresh = false) => {
  if (props.callback) await props.callback();

  await closeTimePeriodModal(() => getData(), refresh);
};

const getData = () => {
  dayStore.setTimeRecordId(props.timeRecordId);

  if (props.updatedOn && props.clearUpdatedOn) {
    props.clearUpdatedOn();
  }

  return dayStore.fetch();
};

const getSessionColor = (type: string) => {
  if (type === "break") return "blue";
  if (type === "pomodoro") return "red";
  return "primary";
};

const getSessionLabel = (type: string) => {
  if (type === "break") return _$t("break");
  if (type === "pomodoro") return _$t("pomodoro");
  return _$t("timerType");
};

const isFetchNow = computed(() => {
  return dayStore.isFetch || props.isFetch;
});

watch(
  () => props.timeRecord?.title,
  () => {
    updateTimeRecordPageBreadcrumb(props.timeRecord?.title);
  }
);

onMounted(async () => {
  updateTimeRecordPageBreadcrumb(props.timeRecord?.title);
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
      <section class="flex md:flex-row justify-between gap-5 flex-col">
        <section>
          <h2 class="text-4xl font-bold">
            {{ "Histórico de Registros" }}

            <GUpdatedOn
              v-if="updatedOn"
              :disabled="isFetchNow"
              :updated-on="updatedOn"
              :click-action="getData"
            />
          </h2>
          <span>Listagem por data de criação de sessões e períodos.</span>
        </section>

        <div v-if="timeRecordId" class="flex gap-5 flex-row items-start mt-1">
          <TimePeriodButtonAdd
            :time-record-id="timeRecordId"
            :disabled="isFetchNow"
            @open="createTimePeriod"
          />
        </div>
      </section>
    </section>

    <section
      v-if="isFetchNow"
      class="w-full col-span-12 grid grid-cols-1 items-start md:grid-cols-12 gap-5 md:gap-5"
    >
      <USkeleton class="h-[260px] w-full col-span-12" />
    </section>

    <section
      v-else-if="dayStore.apiRes?.data?.length"
      class="w-full col-span-12 flex"
    >
      <Line
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
        style="max-height: 280px"
      />
    </section>

    <section
      v-if="isFetchNow"
      class="w-full col-span-12 grid grid-cols-1 items-start md:grid-cols-12 gap-5 md:gap-5"
    >
      <USkeleton class="h-44 w-full col-span-1 md:col-span-6 lg:col-span-4" />
      <USkeleton class="h-48 w-full col-span-1 md:col-span-6 lg:col-span-4" />
      <USkeleton class="h-32 w-full col-span-1 md:col-span-6 lg:col-span-4" />
    </section>

    <Card
      v-else-if="dayStore.apiRes?.data?.length"
      v-for="day in dayStore.apiRes.data"
      class="w-full col-span-1 md:col-span-6 lg:col-span-4"
    >
      <CardContent>
        <h3 class="text-xl inline-flex gap-2 items-center pt-5">
          {{ format(day.date, "dd/MM/yyyy") }}
        </h3>

        <p class="text-md pb-1">
          <span class="flex gap-1 content-center">
            Total: {{ day.formattedTime }}

            <UPopover mode="hover">
              <UIcon
                name="i-icon-park-outline-attention"
                class="w-3 h-3 -translate-y-1"
              />

              <template #panel>
                <section class="p-2 max-w-96 leading-none">
                  <span class="text-xs">
                    O "Total" é a soma de todos os períodos de tempo e sessões
                    que iniciaram entre 00:00:00 e 23:59:59, mesmo que finalizem
                    depois desse horário (próximo dia).
                  </span>
                </section>
              </template>
            </UPopover>
          </span>
        </p>

        <template v-if="day.timerSessions.length">
          <UDivider class="py-2" />

          <p class="text-lg flex gap-1">
            Sessões

            <UPopover mode="hover">
              <UIcon
                name="i-icon-park-outline-attention"
                class="w-3 h-3 -translate-y-1"
              />

              <template #panel>
                <section class="p-2 max-w-96 leading-none">
                  <span class="text-xs">
                    Sessões iniciadas entre 00:00:00 e 23:59:59. O cálculo de
                    horas considera períodos finalizados no próximo dia.
                  </span>
                </section>
              </template>
            </UPopover>
          </p>

          <p class="text-sm">
            {{ day.timerSessionsFormattedTime }}, {{ day.timerSessions.length }}
            {{ day.timerSessions.length > 1 ? "sessões" : "sessão" }}
          </p>

          <section
            v-if="day.timerSessions.length"
            class="flex flex-row gap-2 flex-wrap py-2"
          >
            <UPopover
              v-for="(timerSession, index) in day.timerSessions"
              :key="timerSession.id"
              mode="hover"
            >
              <UBadge
                :color="getSessionColor(timerSession.type)"
                :variant="index % 2 == 0 ? 'subtle' : 'soft'"
                size="md"
              >
                {{ timerSession.formattedTime || "0s" }}
              </UBadge>

              <template #panel>
                <div class="p-2 pt-1 flex flex-col items-center gap-2">
                  <p class="text-sm">
                    {{ getSessionLabel(timerSession.type) }}
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

                    <section class="flex gap-2">
                      <UBadge
                        color="yellow"
                        variant="subtle"
                        :title="tp.formattedTime"
                      >
                        {{ tp.formattedTime }}
                      </UBadge>

                      <UButton
                        color="gray"
                        variant="ghost"
                        size="2xs"
                        icon="i-icon-park-outline-delete-themes"
                        @click="openDeleteTpModal(tp.id)"
                      />
                    </section>
                  </section>

                  <section>
                    <UButton
                      :label="_$t('delete')"
                      color="gray"
                      variant="ghost"
                      icon="i-icon-park-outline-delete-themes"
                      @click="openDeleteTsModal(timerSession.id)"
                    />
                  </section>
                </div>
              </template>
            </UPopover>
          </section>
        </template>

        <template v-if="day.timePeriods.length">
          <UDivider class="py-2" />

          <p class="text-lg flex gap-1">
            Períodos

            <UPopover mode="hover">
              <UIcon
                name="i-icon-park-outline-attention"
                class="w-3 h-3 -translate-y-1"
              />

              <template #panel>
                <section class="p-2 max-w-96 leading-none">
                  <span class="text-xs">
                    Períodos criados entre 00:00:00 e 23:59:59. O cálculo de
                    horas considera períodos finalizados no próximo dia.
                  </span>
                </section>
              </template>
            </UPopover>
          </p>

          <p class="text-sm">
            {{ day.timePeriodsFormattedTime }}, {{ day.timePeriods.length }}
            {{ day.timePeriods.length > 1 ? "períodos" : "período" }}
          </p>

          <section class="flex flex-row gap-2 flex-wrap py-2">
            <UPopover
              v-for="(period, index) in day.timePeriods"
              :key="period.id"
              mode="hover"
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
      </CardContent>
    </Card>

    <section
      v-else
      :class="[
        'col-span-full flex justify-center md:items-center flex-col pt-12 pb-8',
        isDark && 'opacity-50',
      ]"
    >
      <h4 class="text-3xl">Não há nada por aqui...</h4>
      <span class="text-lg">
        Adicione um período de tempo ou utilize o cronômetro.
      </span>
    </section>

    <section class="col-span-full">
      <GPagination
        :page="dayStore.apiRes?.page"
        :perPage="dayStore.apiRes?.perPage"
        :totalPages="dayStore.apiRes?.totalPages"
        :totalItems="dayStore.apiRes?.totalItems"
        :store="dayStore"
        :is-fetch="isFetch"
        :perPageList="[9, 18]"
      />
    </section>
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
    :isFetch="deleteTpIsFetch"
    :title="_$t('confirmDeleteTimePeriodMessage')"
    @confirm="deleteTpAction"
    @cancel="closeDeleteTpModal"
  />

  <GModalConfirm
    v-model:open="deleteTsModal.open"
    :isFetch="deleteTsIsFetch"
    title="Tem certeza que deseja apagar essa sessão?"
    description="Todos os períodos de tempo relacionados à essa sessão também serão excluídos."
    custom-width="w-96"
    @confirm="deleteTsAction"
    @cancel="closeDeleteTsModal"
  />
</template>
