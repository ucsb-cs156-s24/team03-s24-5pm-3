import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
    console.log(message);
    toast(message.message);
}

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/ucsbDiningCommonsMenuItems",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}

