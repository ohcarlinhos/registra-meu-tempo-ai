<script lang="ts" setup>
import { format } from "date-fns";

const route = useRoute();
const { t } = useI18n();

const trReq = ref<TimeRecordType>();

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

const emit = defineEmits<{
  delete: [value: number];
}>();

const getTimeRecordData = async () => {
  const data = await getTimeRecordById(
    parseInt(route.params.id as string),
    true
  );

  if (data) trReq.value = data;
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

    modal.confirmDeleteTp.open = false;
  } catch (err) {
    ErrorToast(err);
  }
};

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
      <div class="w-full col-span-12 mb-5">
        <h2 class="text-4xl font-bold mb-2">
          {{ "Id: " + trReq.id }}{{ trReq.code ? " | " + trReq.code : "" }}
        </h2>

        <p v-if="trReq.categoryName" class="text-lg">
          <b>Categoria:</b> {{ trReq.categoryName }}
        </p>

        <p v-if="trReq.description" class="text-lg">
          <b>Descrição:</b> {{ trReq.description }}
        </p>
      </div>

      <div class="w-full col-span-1 lg:col-span-4">
        <TimerDefault options-modal :id="trReq.id" />

        <h2 class="text-2xl mb-2 mt-6 font-bold">Cronômetro Simples</h2>

        <p>
          Aperte o botão de iniciar e de finalizar, dessa forma seu tempo será
          salvo nesse registro.
        </p>

        <TimerSimple
          :id="parseInt(route.params.id as string)"
          :callback="getTimeRecordData"
        />
      </div>

      <div class="w-full col-span-1 lg:col-span-4">
        <UCard>
          <h2 class="mb-2 text-2xl font-bold">Estatísticas</h2>

          <section class="text-lg">
            <p class="mb-1"><b>Períodos:</b> {{ trReq.timePeriodsCount }}</p>

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

      <div class="w-full col-span-1 lg:col-span-4">
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
              label="Adicionar"
              @click="openTimePeriodModal(trReq!.id)"
            />
          </div>
        </UContainer>

        <UCard v-if="trReq && trReq.timePeriods && trReq.timePeriods.length">
          <section class="flex flex-row gap-2 flex-wrap">
            <UPopover
              v-for="(period, index) in trReq.timePeriods"
              :key="period.id"
              mode="hover"
            >
              <UBadge
                color="primary"
                :variant="index % 2 == 0 ? 'subtle' : 'soft'"
                size="md"
              >
                {{ period.formattedTime || "0s" }}
              </UBadge>

              <template #panel>
                <div class="p-2 pt-4 flex flex-col items-center gap-3">
                  <span>
                    <span class="p-2">#{{ index + 1 }}</span>

                    <UBadge
                      color="primary"
                      :variant="index % 2 == 0 ? 'subtle' : 'soft'"
                    >
                      {{ period.formattedTime || "0s" }}
                    </UBadge>
                  </span>

                  <section class="flex flex-col items-center gap-2">
                    <UBadge color="gray" variant="solid">
                      {{
                        $t("g.start") +
                        ": " +
                        format(period.start, "dd/MM/yyyy HH:mm:ss")
                      }}
                    </UBadge>

                    <UBadge color="gray" variant="solid">
                      {{
                        $t("g.end") +
                        ": " +
                        format(period.end, "dd/MM/yyyy HH:mm:ss")
                      }}
                    </UBadge>
                  </section>

                  <section>
                    <UButton
                      color="gray"
                      variant="ghost"
                      label="Editar"
                      icon="i-heroicons-trash-20-solid"
                      @click="editTimePeriod(period)"
                    />

                    <UButton
                      color="gray"
                      variant="ghost"
                      label="Apagar"
                      icon="i-heroicons-pencil-square-20-solid"
                      @click="openConfirmDeleteTpModal(period.id!)"
                    />
                  </section>
                </div>
              </template>
            </UPopover>
          </section>
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
