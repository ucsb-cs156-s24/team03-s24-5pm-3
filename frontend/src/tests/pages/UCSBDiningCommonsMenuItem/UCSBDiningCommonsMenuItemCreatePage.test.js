import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage  from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemCreatePage  />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /restaurants", async () => {

        const queryClient = new QueryClient();
        const restaurant = {
            id: 3,
            code: "PORT",
            name: "Taco",
            station: "Station 3"
        };

        axiosMock.onPost("/api/ucsbDiningCommonsMenuItems/post").reply(202, restaurant);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemCreatePage/>
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Name")).toBeInTheDocument();
        });

        const codeInput = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
 
        const nameInput = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");

        const stationInput = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
      
        const createButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.change(codeInput, { target: { value: 'PORT' } })
        fireEvent.change(nameInput, { target: { value: 'Taco' } })
        fireEvent.change(stationInput, { target: { value: 'Station 3' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            diningCommonsCode: "PORT",
            name: "Taco",
            station: "Station 3"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New restaurant Created - id: 3 name: Taco");
        expect(mockNavigate).toBeCalledWith({ "to": "/diningcommonsmenuitem" });

    });
});


