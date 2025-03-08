<script lang="ts" setup>
import { Line } from "vue-chartjs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2, Info } from "lucide-vue-next";

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

const dayStore = useTimeRecordHistoryStore();

const chartData = computed(() => {
  return {
    labels:
      dayStore.chartData.map((i) => format(i.date, "d/MM/yy"), {
        locale: ptBR,
      }) || [],
    datasets: [
      {
        label: "Minutos",
        data: dayStore.chartData.map((i) => i.timeOnMinutes) || [],
        borderWidth: 2,
        pointBorderWidth: 5,
        fill: true,
      },
    ],
  };
});

const chartOptions = computed(() => {
  const dayChartDay = dayStore?.chartData;

  var callbacks = {
    title: function (items: any) {
      return `Dia ${items[0].label}`;
    },
    label: function (tooltipItem: any) {
      const idx = tooltipItem.dataIndex;
      const value = tooltipItem.formattedValue;
      const formattedTime = dayChartDay[idx].formattedTime;
      return [`${value} minutos`, formattedTime && `(${formattedTime})`];
    },
  };

  return {
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
        callbacks,
      },
    },
  };
});

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
  if (type === "break") return "border-blue-500/80";
  if (type === "pomodoro") return "border-red-500/80";
  return "border-green-500/80";
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
  <section class="w-full grid grid-cols-12 items-start gap-5">
    <section class="w-full col-span-12">
      <section class="flex flex-col md:flex-row justify-between gap-5">
        <section class="w-full">
          <h2 class="text-4xl font-bold flex items-center gap-5">
            {{ "Histórico de Registros" }}

            <GUpdatedOn
              v-if="updatedOn"
              :loading="isFetchNow"
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

    <section v-if="isFetchNow" class="col-span-12 flex gap-5">
      <Skeleton class="h-[260px] w-full" />
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
      class="w-full col-span-12 grid items-start grid-cols-12 gap-5"
    >
      <Skeleton class="h-44 w-full col-span-full md:col-span-4 lg:col-span-3" />
      <Skeleton class="h-48 w-full col-span-full md:col-span-4 lg:col-span-3" />
      <Skeleton class="h-32 w-full col-span-full md:col-span-4 lg:col-span-3" />
      <Skeleton class="h-48 w-full col-span-full md:col-span-4 lg:col-span-3" />
    </section>

    <Card
      v-else-if="dayStore.apiRes?.data?.length"
      v-for="day in dayStore.apiRes.data"
      class="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
    >
      <CardContent>
        <h3 class="text-xl inline-flex gap-2 items-center pt-5">
          {{ format(day.date, "dd/MM/yyyy") }}
        </h3>

        <p class="text-md pb-1">
          <span class="flex gap-1 content-center">
            Total: {{ day.formattedTime }}

            <Popover>
              <PopoverTrigger>
                <Info class="w-3 h-3 -translate-y-1" />
              </PopoverTrigger>

              <PopoverContent>
                <section class="max-w-96 leading-none">
                  <span class="text-xs">
                    O "Total" é a soma de todos os períodos de tempo e sessões
                    que iniciaram entre 00:00:00 e 23:59:59, mesmo que finalizem
                    depois desse horário (próximo dia).
                  </span>
                </section>
              </PopoverContent>
            </Popover>
          </span>
        </p>

        <template v-if="day.timerSessions.length">
          <Separator class="my-2" />

          <p class="text-lg flex gap-1">
            Sessões

            <Popover>
              <PopoverTrigger>
                <Info class="w-3 h-3 -translate-y-1" />
              </PopoverTrigger>

              <PopoverContent>
                <section class="max-w-96 leading-none">
                  <span class="text-xs">
                    Sessões iniciadas entre 00:00:00 e 23:59:59. O cálculo de
                    horas considera períodos finalizados no próximo dia.
                  </span>
                </section>
              </PopoverContent>
            </Popover>
          </p>

          <p class="text-sm">
            {{ day.timerSessionsFormattedTime }}, {{ day.timerSessions.length }}
            {{ day.timerSessions.length > 1 ? "sessões" : "sessão" }}
          </p>

          <section
            v-if="day.timerSessions.length"
            class="flex flex-row gap-2 flex-wrap py-2"
          >
            <Popover
              v-for="timerSession in day.timerSessions"
              :key="timerSession.id"
            >
              <PopoverTrigger>
                <Badge
                  variant="outline"
                  :class="getSessionColor(timerSession.type)"
                >
                  {{ timerSession.formattedTime || "0s" }}
                </Badge>
              </PopoverTrigger>

              <PopoverContent>
                <div class="flex flex-col items-center gap-2">
                  <p class="text-sm">
                    {{ getSessionLabel(timerSession.type) }}
                  </p>

                  <Separator class="mb-1" />

                  <section
                    v-for="tp in timerSession.timePeriods"
                    :key="tp.id"
                    class="flex justify-around items-center gap-2"
                  >
                    <Badge variant="outline">
                      {{ format(tp.start, "HH:mm:ss") }} até
                      {{ format(tp.end, "HH:mm:ss") }}
                    </Badge>

                    <section class="flex items-center gap-2">
                      <Badge variant="outline">
                        {{ tp.formattedTime }}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        class="h-6 w-6"
                        @click="openDeleteTpModal(tp.id)"
                      >
                        <Trash2 />
                      </Button>
                    </section>
                  </section>

                  <Separator class="my-2" label="Ações" />

                  <section>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="openDeleteTsModal(timerSession.id)"
                    >
                      <Trash2 />
                      {{ _$t("delete") }}
                    </Button>
                  </section>
                </div>
              </PopoverContent>
            </Popover>
          </section>
        </template>

        <template v-if="day.timePeriods.length">
          <Separator class="my-2" />

          <p class="text-lg flex gap-1">
            Períodos

            <Popover>
              <PopoverTrigger>
                <Info class="w-3 h-3 -translate-y-1" />
              </PopoverTrigger>

              <PopoverContent>
                <section class="max-w-96 leading-none">
                  <span class="text-xs">
                    Períodos criados entre 00:00:00 e 23:59:59. O cálculo de
                    horas considera períodos finalizados no próximo dia.
                  </span>
                </section>
              </PopoverContent>
            </Popover>
          </p>

          <p class="text-sm">
            {{ day.timePeriodsFormattedTime }}, {{ day.timePeriods.length }}
            {{ day.timePeriods.length > 1 ? "períodos" : "período" }}
          </p>

          <section class="flex flex-row gap-2 flex-wrap py-2">
            <Popover
              v-for="(period, index) in day.timePeriods"
              :key="period.id"
            >
              <PopoverTrigger>
                <Badge variant="outline" class="border-yellow-500/80">
                  {{ period.formattedTime || "0s" }}
                </Badge>
              </PopoverTrigger>

              <PopoverContent>
                <div class="flex flex-col items-center gap-2">
                  <section class="flex items-center gap-2">
                    <Badge variant="outline">
                      {{ format(period.start, "HH:mm:ss") }}
                    </Badge>
                    até
                    <Badge variant="outline">
                      {{ format(period.end, "HH:mm:ss") }}
                    </Badge>
                  </section>

                  <Separator class="my-2" label="Ações" />

                  <section>
                    <TimePeriodButtonEdit
                      :time-period="period"
                      @open="editTimePeriod"
                    />

                    <Button
                      variant="ghost"
                      size="sm"
                      @click="openDeleteTpModal(period.id!)"
                    >
                      <Trash2 />
                      {{ _$t("delete") }}
                    </Button>
                  </section>
                </div>
              </PopoverContent>
            </Popover>
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
      />
    </section>
  </section>

  <Dialog v-bind:open="tpModal.open" @update:open="tpModal.open = $event">
    <DialogContent>
      <DialogHeader>
        <DialogTitle> Registro de Tempo </DialogTitle>

        <DialogDescription>
          Crie ou atualize seus registros de tempo que possuem início e fim.
        </DialogDescription>
      </DialogHeader>

      <TimePeriodFormCreateAndUpdate
        :time-record-id="tpModal.timeRecordId"
        :edit-object="tpModal.form"
        @close="closeTimePeriodCallback"
      />
    </DialogContent>
  </Dialog>

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
