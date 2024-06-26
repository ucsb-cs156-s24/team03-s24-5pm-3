import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBDiningCommonsMenuItemForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Dining Commons Code", "Name", "Station"];
    const testId = "UCSBDiningCommonsMenuItemForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });


    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm  initialContents={ucsbDiningCommonsMenuItemFixtures.oneDining} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-name`)).toBeInTheDocument();
        expect(screen.getByText(`Name`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-diningCommonsCode`)).toBeInTheDocument();
        expect(screen.getByText(`Dining Commons Code`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-station`)).toBeInTheDocument();
        expect(screen.getByText(`Station`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm  />
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
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Name is required./);
        expect(screen.getByText(/Dining Commons Code is required./)).toBeInTheDocument();
        expect(screen.getByText(/Station is required./)).toBeInTheDocument();

        const nameInput = screen.getByTestId(`${testId}-name`);
        fireEvent.change(nameInput, { target: { value: "a".repeat(256) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max name length 255 characters/)).toBeInTheDocument();
        });

        const codeInput = screen.getByTestId(`${testId}-diningCommonsCode`);
        fireEvent.change(codeInput, { target: { value: "a".repeat(256) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max code length 255 characters/)).toBeInTheDocument();
        });

        const stationInput = screen.getByTestId(`${testId}-station`);
        fireEvent.change(stationInput, { target: { value: "a".repeat(256) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max station length 255 characters/)).toBeInTheDocument();
        });

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-name");

        const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
        const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
        const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.change(nameField, { target: { value: 'DLG' } });
        fireEvent.change(diningCommonsCodeField, { target: { value: 'Pizza' } });
        fireEvent.change(stationField, { target: { value: 'station 1' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Name is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Dining commons Code is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Station is required/)).not.toBeInTheDocument();

    });


});