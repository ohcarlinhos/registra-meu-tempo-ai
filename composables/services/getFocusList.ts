import { FormatedFocus } from "~/classes/FormatedFocus";
import type { FocusType } from "~/types/FocusType";

export const getFocusList = async function () {
    const { data, error } = await useAsyncData("focus", () =>
        $fetch("/focus", {
            retry: false,
            baseURL: "http://localhost:33123/api/v1",
            method: "get",
            headers: {
                Authorization: `Bearer ${useAuthStore().getUserToken}`,
            },
        },)
    );

    if (error.value) throw (error.value.data as { message: string }).message;

    const { Data } = data.value as { Data: FocusType[] };

    return Data.map(
        (i) =>
            new FormatedFocus(
                i.Id,
                i.Title,
                i.RegisterDate,
                i.Duration.InSeconds,
                i.CategoryName
            )
    );
};
