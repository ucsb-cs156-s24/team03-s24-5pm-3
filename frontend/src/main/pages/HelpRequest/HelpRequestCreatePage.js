import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestCreatePage({storybook=false}) {

  const objectToAxiosParams = (helprequests) => ({
    url: "/api/helprequests/post",
    method: "POST",
    params: {
      requesterEmail: helprequests.requesterEmail,
      teamId: helprequests.teamId,
      tableOrBreakoutRoom: helprequests.tableOrBreakoutRoom,
      requestTime: helprequests.requestTime,
      explanation: helprequests.explanation,
      solved: helprequests.solved
    }
  });

  const onSuccess = (helprequests) => {
    toast(`New ucsbDate Created - id: ${helprequests.id} name: ${helprequests.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/helprequests/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequests" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Help Request</h1>

        <HelpRequestForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}
