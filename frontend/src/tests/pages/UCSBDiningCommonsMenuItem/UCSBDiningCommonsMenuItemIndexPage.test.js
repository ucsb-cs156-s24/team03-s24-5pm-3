import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("UCSBDiningCommonsMenuItemIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "UCSBDiningCommonsMenuItemTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    const queryClient = new QueryClient();

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/ucsbDiningCommonsMenuItems/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemIndexPage/>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create UCSBDiningCommonsMenuItem/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create UCSBDiningCommonsMenuItem/);
        expect(button).toHaveAttribute("href", "/ucsbDiningCommonsMenuItems/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three dining halls correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/ucsbDiningCommonsMenuItems/all").reply(200, ucsbDiningCommonsMenuItemFixtures.threeDining);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

        const createUCSBDiningCommonsMenuItemButton  = screen.queryByText("Create UCSBDiningCommonsMenuItem");
        expect(createUCSBDiningCommonsMenuItemButton ).not.toBeInTheDocument();

        const name = screen.getByText("DLG");
        expect(name).toBeInTheDocument();

        const station = screen.getByText("PORT");
        expect(station).toBeInTheDocument();

        const code = screen.getByText("DLG");
        expect(code).toBeInTheDocument();


        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/ucsbDiningCommonsMenuItems/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/ucsbDiningCommonsMenuItems/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        axiosMock.onGet("/api/ucsbDiningCommonsMenuItems/all").reply(200, ucsbDiningCommonsMenuItemFixtures.threeDining);
        axiosMock.onDelete("/api/ucsbDiningCommonsMenuItems").reply(200, "UCSBDiningCommonsMenuItem with id 1 was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");


        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("UCSBDiningCommons with id 1 deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/ucsbDiningCommonsMenuItems");
        expect(axiosMock.history.delete[0].url).toBe("/api/ucsbDiningCommonsMenuItems");
        expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
    });

});

