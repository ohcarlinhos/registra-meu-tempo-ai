<script lang="ts" setup>
import * as yup from "yup";

const modal = reactive({
  createOrUpdateTimeRecord: false,
  confirmDelete: {
    open: false,
    id: null as null | number,
    title: "",
  },
});

const trStore = useTimeRecordStore();
const { isDeleteFetch } = storeToRefs(trStore);

const editTimeRecordObject = ref<TimeRecordForm | undefined>(undefined);
const router = useRouter();

const refFormConfirm = ref();

const formConfirm = reactive({
  originalCode: "",
  code: "",
});

const formConfirmSchema = yup.object({
  code: yup
    .string()
    .oneOf([yup.ref("originalCode")], _$t("codeIsWrong"))
    .required(_$t("codeIsRequired")),
});

const closeConfirmDeleteModal = () => {
  modal.confirmDelete.id = null;
  modal.confirmDelete.open = false;

  formConfirm.originalCode = "";
  formConfirm.code = "";
};

const openConfirmDeleteModal = async (tr: TimeRecordMap) => {
  modal.confirmDelete.id = tr.id;
  modal.confirmDelete.title = tr.title;
  modal.confirmDelete.open = true;

  formConfirm.originalCode = tr.code;
};

const access = (code: string) => {
  router.push({
    name: "record",
    params: { code },
  });
};

const closeModal = () => {
  modal.createOrUpdateTimeRecord = false;
  editTimeRecordObject.value = undefined;
};

const deleteTimeRecord = async () => {
  if (!modal.confirmDelete.id) return;

  try {
    await trStore.delete(modal.confirmDelete.id);
    closeConfirmDeleteModal();
  } catch (error) {
    ErrorToast(error);
  } finally {
  }
};
</script>

<template>
  <section class="grid grid-cols-12 gap-5 w-full">
    <section class="col-span-full lg:col-span-12">
      <TimeRecordTable
        @access="access"
        @create="modal.createOrUpdateTimeRecord = true"
        @delete="openConfirmDeleteModal"
      />
    </section>
  </section>

  <GModalConfirm
    v-model:open="modal.confirmDelete.open"
    :title="
      $t('confirmDeleteTimeRecordMessage', {
        title: modal.confirmDelete.title,
      })
    "
    :description="_$t('confirmCodeToDeleteRecord')"
    :isFetch="isDeleteFetch"
    :disableConfirm="
      (refFormConfirm && refFormConfirm.errors.length > 0) ||
      !formConfirm.code ||
      formConfirm.code != formConfirm.originalCode
    "
    custom-width="w-96"
    @confirm="deleteTimeRecord"
    @cancel="closeConfirmDeleteModal"
  >
    <section>
      <UBadge variant="subtle" size="xs" color="red">
        {{ formConfirm.originalCode }}
      </UBadge>
    </section>

    <UForm
      :state="formConfirm"
      :schema="formConfirmSchema"
      ref="refFormConfirm"
    >
      <UFormGroup :label="_$t('code')" name="code" required>
        <UInput type="text" v-model="formConfirm.code" autofocus />
      </UFormGroup>
    </UForm>
  </GModalConfirm>

  <UModal v-model="modal.createOrUpdateTimeRecord" prevent-close>
    <TimeRecordFormCreateAndUpdate @close="closeModal" />
  </UModal>
</template>
