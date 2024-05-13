import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsbdiningcommonsmenuitem) => ({
    url: "/api/ucsbDiningCommonsMenuItems/post",
    method: "POST",
    params: {
      name: ucsbdiningcommonsmenuitem.name,
      station: ucsbdiningcommonsmenuitem.station,
      diningCommonsCode: ucsbdiningcommonsmenuitem.diningCommonsCode
    }
  });

  const onSuccess = (ucsbdiningcommonsmenuitem) => {
    toast(`New restaurant Created - id: ${ucsbdiningcommonsmenuitem.id} name: ${ucsbdiningcommonsmenuitem.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/ucsbDiningCommonsMenuItems/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/diningcommonsmenuitem" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBDiningCommonsMenuItem</h1>
        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
