<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/yup";
import { useEventBus } from "@vueuse/core";
import { useForm } from "vee-validate";
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

const formConfirmSchema = toTypedSchema(
  yup.object({
    originalCode: yup.string(),
    code: yup.string().oneOf([yup.ref("originalCode")], _$t("codeIsWrong")),
  })
);

const {
  handleSubmit,
  setValues,
  values: formValues,
} = useForm({
  validationSchema: formConfirmSchema,
  keepValuesOnUnmount: false,
});

const closeConfirmDeleteModal = () => {
  modal.confirmDelete.id = null;
  modal.confirmDelete.open = false;
};

const openConfirmDeleteModal = async (event: TimeRecordTableBusEvent) => {
  const tr = event.data;

  modal.confirmDelete.id = tr.id;
  modal.confirmDelete.title = tr.title;
  modal.confirmDelete.open = true;

  setValues({
    originalCode: tr.code,
  });
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

const onSubmit = handleSubmit(() => deleteTimeRecord());

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

const bus = useEventBus<TimeRecordTableBusEvent>(TR_TABLE_BUS_NAME);

const handleWithBus = (event: TimeRecordTableBusEvent) => {
  if (event.action == "access") {
    router.push({
      name: "record",
      params: { code: event.data.code },
    });
  }

  if (event.action == "delete") {
    openConfirmDeleteModal(event);
  }
};

bus.on(handleWithBus);

onBeforeUnmount(() => {
  bus.off(handleWithBus);
});
</script>

<template>
  <section class="grid grid-cols-12 gap-5 w-full">
    <section class="col-span-full lg:col-span-12">
      <TimeRecordTable
        @access="access"
        @create="modal.createOrUpdateTimeRecord = true"
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
    :disable-confirm="!formValues.code"
    custom-width="w-96"
    @confirm="onSubmit"
    @cancel="closeConfirmDeleteModal"
  >
    <section>
      <Badge variant="outlineDestructive">
        {{ formValues.originalCode }}
      </Badge>
    </section>

    <form>
      <FormField v-slot="{ componentField }" name="code">
        <FormItem>
          <FormLabel>{{ _$t("code") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
    </form>
  </GModalConfirm>

  <Dialog
    v-bind:open="modal.createOrUpdateTimeRecord"
    @update:open="!$event && closeModal()"
  >
    <DialogContent @interact-outside="$event.preventDefault()">
      <DialogHeader>
        <DialogTitle>
          {{ _$t("task") }}
        </DialogTitle>

        <DialogDescription>
          {{ _$t("taskModalDescription") }}
        </DialogDescription>
      </DialogHeader>

      <TimeRecordFormCreateAndUpdate @close="closeModal" />
    </DialogContent>
  </Dialog>
</template>
