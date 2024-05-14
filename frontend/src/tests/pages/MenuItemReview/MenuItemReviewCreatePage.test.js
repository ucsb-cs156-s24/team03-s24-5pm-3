import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
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

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const ucsbDate = {
            id: 17,
            quarterYYYYQField: 20221,
            name: "Groundhog Day",
            localDateTime: "2022-02-02T00:00"
        };

        axiosMock.onPost("/api/menuitemreview/post").reply(202, ucsbDate);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("MenuItemReviewForm-reviewerEmail")).toBeInTheDocument();
        });

        const itemID = screen.getByTestId("MenuItemReviewForm-itemID");
        const reviewerEmail = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const stars = screen.getByTestId("MenuItemReviewForm-stars");
        const comments = screen.getByTestId("MenuItemReviewForm-comments");
        const dateReviewed = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemID, { target: { value: '2' } });
        fireEvent.change(reviewerEmail, { target: { value: 'me@tianleyu.com' } });
        fireEvent.change(stars, { target: { value: '1' } });
        fireEvent.change(comments, { target: { value: 'Test' } });
        fireEvent.change(dateReviewed, { target: { value: '2022-02-02T00:00:00' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "comments": "Test",
                "dateReviewed": "2022-02-02T00:00",
                "itemID": "2",
                "reviewerEmail": "me@tianleyu.com",
                "stars": "1",
            });

        expect(mockToast).toBeCalledWith("New MenuItemReview Created - id: 17");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });
    });


});


