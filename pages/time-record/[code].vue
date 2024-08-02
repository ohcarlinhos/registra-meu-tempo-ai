<script lang="ts" setup>
import { format } from "date-fns";

definePageMeta({
  name: "time.record.page",
});

const route = useRoute();
const router = useRouter();

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
  updateTimeRecord: {
    open: false,
  },
});

const editTimeRecordObject = ref<TimeRecordFormType>();

const emit = defineEmits<{
  delete: [value: number];
}>();

const getTimeRecordData = async (code = "") => {
  if (code && code != route.params.code) {
    router.push(`/time-record/${code}`);
    return;
  }

  const data = await getTimeRecordByCode(`${route.params.code}`, true);
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

const deleteTimePeriodFetching = ref(false);

const deleteTimePeriodAction = async () => {
  deleteTimePeriodFetching.value = true;

  try {
    await deleteTimePeriod(modal.confirmDeleteTp.timePeriodId);
    OkToast(t("form.timePeriod.status.success.delete"));

    await getTimeRecordData();

    modal.confirmDeleteTp.open = false;
  } catch (err) {
    ErrorToast(err);
  } finally {
    deleteTimePeriodFetching.value = false;
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

const openTimeRecordModal = () => {
  modal.updateTimeRecord.open = true;
  const tr = trReq.value;

  if (!tr) return;

  editTimeRecordObject.value = {
    id: tr.id,
    title: tr.title,
    description: tr.description,
    category: tr.categoryName || "",
    categoryId: tr.categoryId,
    code: tr.code || "",
    externalLink: tr.externalLink || "",
    timePeriods: [],
    callback: (code) => getTimeRecordData(code),
  };
};

const closeTimeRecordModal = () => {
  modal.updateTimeRecord.open = false;
  editTimeRecordObject.value = undefined;
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
      <div class="w-full lg:col-span-12 mb-5">
        <h2 class="text-4xl font-bold mb-1">
          {{ trReq.title || "Sem título" }}

          <UButton
            icon="i-icon-park-outline-edit"
            :label="$t('edit')"
            @click="openTimeRecordModal"
          />
        </h2>

        <p class="text-2xl pb-6 font-medium">
          Tempo total:
          <span class="text-primary font-bold">
            {{ trReq.formattedTime || "Nenhum" }}
          </span>
        </p>

        <p v-if="trReq.code" class="text-lg font-medium pb-4">
          {{ _$t("code") }}: <span class="font-normal">{{ trReq.code }}</span>
        </p>

        <UCard>
          <p v-if="trReq.description" class="text-lg pb-4">
            <span class="font-normal">{{ trReq.description }}</span>
          </p>

          <p v-else class="text-lg">
            <span class="font-normal">
              {{ _$t("emptyRecordDescription") }}
            </span>
          </p>

          <p v-if="trReq.categoryName" class="text-lg font-medium">
            {{ $t("category") }}:
            <span class="font-normal">{{ trReq.categoryName }}</span>
          </p>

          <p v-if="trReq.externalLink" class="text-lg font-medium flex gap-2">
            {{ $t("externalLink") }}:

            <span
              class="max-w-44 overflow-hidden inline-block overflow-ellipsis whitespace-nowrap"
            >
              <a
                :href="trReq.externalLink"
                target="_blank"
                class="underline hover:text-primary font-normal"
              >
                {{ trReq.externalLink }}
              </a>
            </span>
          </p>
        </UCard>
      </div>

      <div class="w-full col-span-1 lg:col-span-4">
        <TimerDefault
          options-modal
          :id="trReq.id"
          :code="trReq.code"
          :postTimePeriodCallback="getTimeRecordData"
        />
      </div>

      <div class="w-full col-span-1 lg:col-span-4">
        <UCard>
          <h2 class="mb-2 text-2xl font-bold">{{ $t("statistics") }}</h2>

          <section class="text-lg">
            <p class="font-medium">
              {{ _$t("pomodoros") }}:
              <span class="font-normal">
                {{
                  trReq.timeTotalMilliseconds
                    ? (trReq.timeTotalMilliseconds / 1000 / 60 / 25).toFixed(2)
                    : 0
                }}
              </span>
            </p>

            <p class="font-medium">
              {{ $t("periods") }}:
              <span class="font-normal">{{ trReq.timePeriodsCount }}</span>
            </p>
          </section>
        </UCard>
      </div>

      <div class="w-full col-span-1 lg:col-span-4">
        <UContainer
          :ui="{
            base: 'flex flex-row justify-between gap-5',
            padding: 'pb-5 px-0 lg:px-0 sm:px-0',
          }"
        >
          <h2 class="text-2xl font-bold">{{ $t("periods") }}</h2>

          <div v-if="trReq.id" class="flex gap-5 flex-row items-start mt-1">
            <UButton
              icon="i-icon-park-outline-add"
              :label="$t('add')"
              @click="openTimePeriodModal(trReq!.id)"
            />
          </div>
        </UContainer>

        <UCard>
          <section
            v-if="trReq && trReq.timePeriods && trReq.timePeriods.length"
            class="flex flex-row gap-2 flex-wrap"
          >
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
                        $t("start") +
                        ": " +
                        format(period.start, "dd/MM/yyyy HH:mm:ss")
                      }}
                    </UBadge>

                    <UBadge color="gray" variant="solid">
                      {{
                        $t("end") +
                        ": " +
                        format(period.end, "dd/MM/yyyy HH:mm:ss")
                      }}
                    </UBadge>
                  </section>

                  <section>
                    <UButton
                      :label="_$t('edit')"
                      color="gray"
                      variant="ghost"
                      icon="i-icon-park-outline-edit"
                      @click="editTimePeriod(period)"
                    />

                    <UButton
                      :label="_$t('delete')"
                      color="gray"
                      variant="ghost"
                      icon="i-icon-park-outline-delete-themes"
                      @click="openConfirmDeleteTpModal(period.id!)"
                    />
                  </section>
                </div>
              </template>
            </UPopover>
          </section>

          <section v-else>{{ _$t("noPeriodRecorded") }}</section>
        </UCard>

        <GModalConfirm
          v-model:open="modal.confirmDeleteTp.open"
          :fetching="deleteTimePeriodFetching"
          :title="_$t('confirmDeleteTimePeriodMessage')"
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

        <UModal v-model="modal.updateTimeRecord.open" prevent-close>
          <TimeRecordFormCreateAndUpdate
            :edit-object="editTimeRecordObject"
            hide-time-periods
            @close="closeTimeRecordModal"
          />
        </UModal>
      </div>
    </div>

    <div v-else>
      <h2 class="text-2xl text-primary font-bold pb-3">
        {{ _$t("recordNotFound") }}
      </h2>

      <UButton
        @click="router.push({ name: 'time.record.list' })"
        variant="soft"
      >
        {{ _$t("backToRecords") }}
      </UButton>
    </div>
  </UContainer>
</template>

<style></style>
