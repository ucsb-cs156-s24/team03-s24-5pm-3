import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable orgs={ucsbOrganizationFixtures.threeUcsbOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Organization Code", "Organization Translation", "Organization Translation Short", "Inactive"];
    const expectedFields = ["orgCode", "orgTranslation", "orgTranslationShort", "inactive"];
    const testId = "UCSBOrganizationTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("ORG1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("ORG2");

    const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).not.toBeInTheDocument();

  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable orgs={ucsbOrganizationFixtures.threeUcsbOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Organization Code", "Organization Translation", "Organization Translation Short", "Inactive"];
    const expectedFields = ["orgCode", "orgTranslation", "orgTranslationShort", "inactive"];
    const testId = "UCSBOrganizationTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("ORG1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("ORG2");

    expect(screen.getByTestId(`${testId}-cell-row-0-col-inactive`)).toHaveTextContent("No");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-inactive`)).toHaveTextContent("Yes");


    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable orgs={ucsbOrganizationFixtures.threeUcsbOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`UCSBOrganizationTable-cell-row-0-col-orgCode`)).toHaveTextContent("ORG1"); });

    const editButton = screen.getByTestId(`UCSBOrganizationTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/ucsborganization/edit/ORG1'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;
    const testId = "UCSBOrganizationTable";

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable orgs={ucsbOrganizationFixtures.threeUcsbOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("ORG1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`)).toHaveTextContent("Organization 1");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);
  });

  test("Does not break with empty input", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = ["Organization Code", "Organization Translation", "Organization Translation Short", "Inactive"];
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
    expect(screen.queryByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not.toBeInTheDocument();
  });

});

