import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("on submit, makes request to backend, and redirects to /ucsborganization", async () => {
    const queryClient = new QueryClient();
    const ucsborganization = {
      orgCode: "ORG",
      orgTranslationShort: "Org",
      orgTranslation: "Organization",
      inactive: "false",
    };

    axiosMock.onPost("/api/UCSBOrganization/post").reply(202, ucsborganization);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("OrgCode")).toBeInTheDocument();
    });

    const OrgCode = screen.getByLabelText("OrgCode");
    expect(OrgCode).toBeInTheDocument();

    const OrgTranslation = screen.getByLabelText("OrgTranslation");
    expect(OrgTranslation).toBeInTheDocument();

    const OrgTranslationShort = screen.getByLabelText("OrgTranslationShort");
    expect(OrgTranslationShort).toBeInTheDocument();

    const Inactive = screen.getByLabelText("Inactive");
    expect(Inactive).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(OrgCode, { target: { value: ucsborganization.orgCode } });
    fireEvent.change(OrgTranslation, {
      target: { value: ucsborganization.orgTranslation },
    });
    fireEvent.change(OrgTranslationShort, {
      target: { value: ucsborganization.orgTranslationShort },
    });
    fireEvent.change(Inactive, {
      target: { value: ucsborganization.inactive },
    });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual(ucsborganization);

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      `New UCSBOrganization Created - orgCode: ${ucsborganization.orgCode}`
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsborganization" });
  });
});
