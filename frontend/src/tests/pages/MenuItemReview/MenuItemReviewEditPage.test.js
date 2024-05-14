import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbdates", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit MenuItemReview");
            expect(screen.queryByTestId("MenuItemReviewForm-itemID")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).reply(200, menuItemReviewFixtures.threeReviews[0]);
            axiosMock.onPut('/api/menuitemreview').reply(200, menuItemReviewFixtures.threeReviews[1]);
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-itemID");

            const itemID = screen.getByTestId("MenuItemReviewForm-itemID");
            const reviewerEmail = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const stars = screen.getByTestId("MenuItemReviewForm-stars");
            const comments = screen.getByTestId("MenuItemReviewForm-comments");
            const dateReviewed = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(itemID).toHaveValue("5");
            expect(reviewerEmail).toHaveValue("reviewer@gmail.com");
            expect(stars).toHaveValue("5");
            expect(dateReviewed).toHaveValue("2022-01-02T12:00");
            expect(comments).toHaveValue("delicious");

            expect(submitButton).toBeInTheDocument();

        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-itemID");

            const itemID = screen.getByTestId("MenuItemReviewForm-itemID");
            const reviewerEmail = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const stars = screen.getByTestId("MenuItemReviewForm-stars");
            const comments = screen.getByTestId("MenuItemReviewForm-comments");
            const dateReviewed = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(itemID).toHaveValue("5");
            expect(reviewerEmail).toHaveValue("reviewer@gmail.com");
            expect(stars).toHaveValue("5");
            expect(dateReviewed).toHaveValue("2022-01-02T12:00");
            expect(comments).toHaveValue("delicious");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(itemID, { target: { value: '10' } })
            fireEvent.change(reviewerEmail, { target: { value: 'eater@gmail.com' } })
            fireEvent.change(stars, { target: { value: "3" } })
            fireEvent.change(comments, { target: { value: "meh" } })
            fireEvent.change(dateReviewed, { target: { value: "2022-04-03T12:00:00" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("MenuItemReview Updated - id: 2");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
            expect(axiosMock.history.put[0].data).toBe("{\"id\":1,\"itemID\":\"10\",\"reviewerEmail\":\"eater@gmail.com\",\"stars\":\"3\",\"dateReviewed\":\"2022-04-03T12:00\",\"comments\":\"meh\"}"); // posted object
        });


    });
});


