import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { restaurantFixtures } from "fixtures/restaurantFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBOrganizationForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "OrgCode",
    "OrgTranslation",
    "OrgTranslationShort",
    "Inactive",
  ];
  const testId = "UCSBOrganizationForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach(async (headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm
            initialContents={restaurantFixtures.oneRestaurant}
          />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
    expect(screen.getByText(`OrgCode`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    let submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);
    expect(submitButton).toBeInTheDocument();

    await screen.findByText(/OrgCode is required/);
    await screen.findByText(/OrgTranslation is required/);
    await screen.findByText(/OrgTranslationShort is required/);
    await screen.findByText(/Inactive is required/);
    // expect(screen.getByText(/Description is required/)).toBeInTheDocument();
    submitButton = screen.getByTestId(`${testId}-submit`);

    const orgCode = screen.getByTestId(`${testId}-orgCode`);
    fireEvent.change(orgCode, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
    });

    fireEvent.change(orgCode, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/OrgCode is required/)).toBeInTheDocument();
    });

    const orgTranslation = screen.getByTestId(`${testId}-orgTranslation`);
    fireEvent.change(orgTranslation, { target: { value: "a".repeat(33) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
    });

    fireEvent.change(orgTranslation, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/OrgTranslation is required/)
      ).toBeInTheDocument();
    });

    const orgTranslationShort = screen.getByTestId(
      `${testId}-orgTranslationShort`
    );
    fireEvent.change(orgTranslationShort, {
      target: { value: "a".repeat(31) },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
    });

    fireEvent.change(orgTranslationShort, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/OrgTranslationShort is required/)
      ).toBeInTheDocument();
    });

    const inactive = screen.getByTestId(`${testId}-inactive`);

    fireEvent.change(inactive, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Inactive is required/)
      ).toBeInTheDocument();
    });
  });
});
