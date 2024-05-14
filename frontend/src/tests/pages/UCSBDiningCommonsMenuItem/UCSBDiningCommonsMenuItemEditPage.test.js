import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 2
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBDiningCommonsMenuItemEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbDiningCommonsMenuItems", { params: { id: 2 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBDiningCommonsMenuItem");
            expect(screen.queryByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbDiningCommonsMenuItems", { params: { id: 2 } }).reply(200, {
                id: 2,
                diningCommonsCode: "DLG",
                name: "Burrito",
                station: "Main Station 2"
            });
            axiosMock.onPut('/api/ucsbDiningCommonsMenuItems').reply(200, {
                id: "2",
                diningCommonsCode: "PORT",
                name: "Fries",
                station: "Station 3"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");

            const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
            const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
            const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
            const stationField  = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
            const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("2");
            expect( diningCommonsCodeField).toBeInTheDocument();
            expect(diningCommonsCodeField).toHaveValue("DLG");
            expect(nameField).toBeInTheDocument();
            expect(nameField).toHaveValue("Burrito");
            expect(stationField).toBeInTheDocument();
            expect(stationField).toHaveValue("Main Station 2");
            expect(submitButton).toHaveTextContent("Update");

        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");

            const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
            const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
            const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
            const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
            const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

            expect(idField).toHaveValue("2");
            expect(diningCommonsCodeField).toHaveValue("DLG");
            expect(nameField).toHaveValue("Burrito");
            expect(stationField).toHaveValue("Main Station 2");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(diningCommonsCodeField, { target: { value: 'PORT' } })
            fireEvent.change(nameField, { target: { value: 'Fries' } })
            fireEvent.change(stationField, { target: { value: "Station 4" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Dining Commons Updated - id: 2 name: Fries");
            expect(mockNavigate).toBeCalledWith({ "to": "/diningcommonsmenuitem" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 2 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                diningCommonsCode: "PORT",
                name: "Fries",
                station: "Station 4"
            })); // posted object
        });

       
    });
});
