<script lang="ts" setup>
import { format } from "date-fns";

const route = useRoute();
const { t } = useI18n();

const columns = computed(() => [
  { key: "startFormatted", label: t("g.start") },
  { key: "endFormatted", label: t("g.end") },
  { key: "formattedTime", label: t("g.time") },
  { key: "actions" },
]);

const trReq = ref<TimeRecordType>();

const tpReq = ref<Pagination<TimePeriodType>>();
const tpReqFetch = ref(false);

const editTpObject = reactive<TimePeriodFormType>({
  id: 0,
  timeRecordId: 0,
  end: "",
  start: "",
  callback: () => {},
});

const clearTimePeriodObject = () => {
  editTpObject.id = 0;
  editTpObject.timeRecordId = 0;
  editTpObject.start = "";
  editTpObject.end = "";
};

const modal = reactive({
  createOrUpdateTp: {
    open: false,
    timeRecordId: 0,
  },
  confirmDeleteTp: {
    open: false,
    timePeriodId: 0,
  },
});

const computedPage = computed({
  get: () => {
    return tpReq.value?.page || 1;
  },
  set: async (page: number) => {
    await getTpList(page, computedPerPage.value);
  },
});

const computedPerPage = computed({
  get: () => {
    return tpReq.value?.perPage || 4;
  },
  set: async (perPage: number) => {
    await getTpList(1, perPage);
  },
});

const perPageList = ref([4, 8, 12]);

const emit = defineEmits<{
  delete: [value: number];
}>();

const tpFormatted = computed(() => {
  return tpReq.value?.data.length
    ? tpReq.value.data.map((p) => {
        return {
          ...p,
          startFormatted: format(p.start, "dd/MM/yyyy HH:mm:ss"),
          endFormatted: format(p.end, "dd/MM/yyyy HH:mm:ss"),
        };
      })
    : [];
});

const dropMenuItems = (row: TimePeriodType) => [
  [
    {
      label: t("g.edit"),
      icon: "i-heroicons-pencil-square-20-solid",
      click: async () => editTimePeriod(row),
    },
    {
      label: t("g.delete"),
      icon: "i-heroicons-trash-20-solid",
      click: () => openConfirmDeleteTpModal(row.id!),
    },
  ],
];

const getTimeRecordData = async () => {
  const data = await getTimeRecordById(
    parseInt(route.params.id as string),
    true
  );

  if (data) trReq.value = data;

  await getTpList();
};

const editTimePeriod = async (tp: TimePeriodType) => {
  modal.createOrUpdateTp.open = true;
  modal.createOrUpdateTp.timeRecordId = tp.timeRecordId!;

  editTpObject.id = tp.id;
  editTpObject.start = tp.start;
  editTpObject.end = tp.end;
  editTpObject.timeRecordId = tp.timeRecordId!;
  editTpObject.callback = () => {};
};

const deleteTimePeriodAction = async () => {
  try {
    await deleteTimePeriod(modal.confirmDeleteTp.timePeriodId);
    OkToast(t("form.timePeriod.status.success.delete"));

    await getTimeRecordData();
    await getTpList();

    modal.confirmDeleteTp.open = false;
  } catch (err) {
    ErrorToast(err);
  }
};

const getTpList = async (page = 1, perPage = 4) => {
  try {
    tpReqFetch.value = true;

    const data = await getTimePeriods(
      parseInt(route.params.id as string),
      page,
      perPage,
      true
    );

    if (data) tpReq.value = data;
  } finally {
    tpReqFetch.value = false;
  }
};

const showInfos = computed(
  () =>
    trReq.value &&
    (trReq.value?.code || trReq.value?.categoryName || trReq.value?.description)
);

const openTimePeriodModal = (timeRecordId?: number) => {
  if (!timeRecordId) return;

  clearTimePeriodObject();

  modal.createOrUpdateTp.open = true;
  modal.createOrUpdateTp.timeRecordId = timeRecordId;
};

const closeTimePeriodModal = async (refresh = false) => {
  modal.createOrUpdateTp.open = false;

  if (refresh) {
    await getTimeRecordData();
  }
};

const openConfirmDeleteTpModal = (id: number) => {
  modal.confirmDeleteTp.open = true;
  modal.confirmDeleteTp.timePeriodId = id;
};

const closeConfirmDeleteTpModal = () => {
  modal.confirmDeleteTp.open = false;
};

onMounted(async () => {
  await getTimeRecordData();
});
</script>

<template>
  <UContainer
    :ui="{
      padding: 'py-16',
      constrained: 'min-h-svh w-full lg:max-w-7xl',
    }"
  >
    <GHeader small-title />

    <div v-if="trReq" class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div class="w-full col-span-1 lg:col-span-2">
        <h2 class="text-2xl mb-2 font-bold">Salve seu tempo!</h2>

        <p>Continue a registrar períodos de tempo.</p>

        <TimerSimple
          :id="parseInt(route.params.id as string)"
          :callback="getTimeRecordData"
        />

        <!-- <h2 class="mb-2 mt-2 text-2xl font-bold">Anotações</h2>
        <p>// TODO: Ops</p> -->
      </div>

      <div class="w-full col-span-1 lg:col-span-4">
        <h2 v-if="showInfos" class="mb-5 text-2xl font-bold">
          {{ $t("g.infos") }}
        </h2>

        <UCard
          v-if="showInfos"
          :ui="{
            base: 'mb-5',
          }"
        >
          <p v-if="trReq.code"><b>Código:</b> {{ trReq.code }}</p>
          <p v-if="trReq.categoryName">
            <b>Categoria:</b> {{ trReq.categoryName }}
          </p>
          <p v-if="trReq.description">
            <b>Descrição:</b> {{ trReq.description }}
          </p>
        </UCard>

        <UCard>
          <h2 class="mb-2 text-2xl font-bold">Estatísticas</h2>

          <section class="text-lg">
            <p class="mb-1">
              <b>Períodos de tempo:</b> {{ trReq.timePeriodsCount }}
            </p>

            <p class="mb-1">
              <b>Tempo total do registro:</b>
              {{ trReq.formattedTime || $t("g.none") }}
            </p>

            <p class="mb-1">
              Que equivale à
              <b>
                {{
                  trReq.timeTotalMilliseconds
                    ? (trReq.timeTotalMilliseconds / 1000 / 60 / 25).toFixed(2)
                    : 0
                }}
              </b>
              pomodoros!
            </p>
          </section>
        </UCard>
      </div>

      <div class="w-full col-span-1 lg:col-span-6">
        <UContainer
          :ui="{
            base: 'flex flex-col md:flex-row justify-between gap-5',
            padding: 'pb-5 px-0 lg:px-0 sm:px-0',
          }"
        >
          <h2 class="text-2xl font-bold">{{ $t("time.periodList") }}</h2>

          <div v-if="trReq.id" class="flex gap-5 flex-row items-start mt-1">
            <UButton
              icon="i-heroicons-pencil-square-20-solid"
              label="Adicionar Período"
              @click="openTimePeriodModal(trReq!.id)"
            />
          </div>
        </UContainer>

        <UCard>
          <UTable
            :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
            :columns="columns"
            :rows="tpFormatted"
            :loading="false"
          >
            <template #timePeriod-data="{ row }">
              <TimeRecordTableColTimePeriod
                :time-periods="(row as ITimeRecordTable).timePeriods"
                :label="(row as ITimeRecordTable).timePeriodsCountText || '0'"
              />
            </template>

            <template #actions-data="{ row }">
              <div class="flex justify-end">
                <UDropdown :items="dropMenuItems(row)">
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-horizontal-20-solid"
                  />
                </UDropdown>
              </div>
            </template>
          </UTable>

          <div class="flex justify-between items-end mt-3">
            <div>
              <UPagination
                v-if="tpReq && tpReq.totalPages > 1"
                v-model="computedPage"
                :page-count="tpReq.perPage"
                :total="tpReq.totalItems"
                :disabled="tpReqFetch"
              />
            </div>

            <div class="flex items-center gap-2">
              Itens por página:
              <USelect
                v-model="computedPerPage"
                :options="perPageList"
                :disabled="tpReqFetch"
              />
            </div>
          </div>
        </UCard>

        <GModalConfirm
          v-model:open="modal.confirmDeleteTp.open"
          text="Tem certeza que quer excluir esse registro?"
          @confirm="deleteTimePeriodAction"
          @cancel="closeConfirmDeleteTpModal"
        />

        <UModal v-model="modal.createOrUpdateTp.open" prevent-close>
          <TimePeriodFormCreateAndUpdate
            :time-record-id="modal.createOrUpdateTp.timeRecordId"
            :edit-object="editTpObject"
            @close="closeTimePeriodModal"
          />
        </UModal>
      </div>
    </div>
  </UContainer>
</template>

<style></style>
