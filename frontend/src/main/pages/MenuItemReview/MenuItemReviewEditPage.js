import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDatesEditPage({ storybook = false }) {
  let { id } = useParams();

  const { data: ucsbDate, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/menuitemreview?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/menuitemreview`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (ucsbDate) => ({
    url: "/api/menuitemreview",
    method: "PUT",
    params: {
      id: ucsbDate.id,
    },
    data: ucsbDate
  });

  const onSuccess = (ucsbDate) => {
    toast(`UCSBDate Updated - id: ${ucsbDate.id} name: ${ucsbDate.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/menuitemreview?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreview" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBDate</h1>
        {
          ucsbDate && <MenuItemReviewForm initialContents={ucsbDate} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

