import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDatesEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: orgInit,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/UCSBOrganization?orgCode=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/UCSBOrganization`,
      params: {
        orgCode: id,
      },
    }
  );

  const objectToAxiosPutParams = (org) => ({
    url: "/api/UCSBOrganization",
    method: "PUT",
    params: {
      orgCode: org.orgCode,
    },
    data: {
      orgCode: org.orgCode,
      orgTranslation: org.orgTranslation,
      orgTranslationShort: org.orgTranslationShort,
      inactive: org.inactive,
    },
  });

  const onSuccess = (orgInit) => {
    toast(`UCSBDate Updated - Organication Code: ${orgInit.orgCode}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/UCSBOrganization?orgCode=${id}`]
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganization" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBDate</h1>
        {orgInit && (
          <UCSBOrganizationForm
            initialContents={orgInit}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
