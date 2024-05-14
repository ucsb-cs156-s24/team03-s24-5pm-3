import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("MenuItemReviewForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByText(/Date Reviewed/);
        await screen.findByText(/Item Id/);
        await screen.findByText(/Reviewer Email/);
        await screen.findByText(/Stars/);
        await screen.findByText(/Comments/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a Review", async () => {

        render(
            <Router  >
                <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneReview} />
            </Router>
        );
        await screen.findByTestId(/MenuItemReviewForm-id/);
        expect(screen.getByText(/ID/)).toBeInTheDocument();
        expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-dateReviewed");
        const dateReviewed = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(dateReviewed, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Date Reviewed is required./);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-submit");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Date Reviewed is required./);
        expect(screen.getByText(/Date Reviewed is required./)).toBeInTheDocument();
        expect(screen.getByText(/Item Id is required./)).toBeInTheDocument();
        expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Stars is required./)).toBeInTheDocument();
        expect(screen.getByText(/Comments is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <MenuItemReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemID");

        const itemID = screen.getByTestId("MenuItemReviewForm-itemID");
        const reviewerEmail = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const stars = screen.getByTestId("MenuItemReviewForm-stars");
        const comments = screen.getByTestId("MenuItemReviewForm-comments");
        const dateReviewed = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemID, { target: { value: '20221' } });
        fireEvent.change(reviewerEmail, { target: { value: 'me@tianleyu.com' } });
        fireEvent.change(stars, { target: { value: '1' } });
        fireEvent.change(comments, { target: { value: 'Test' } });
        fireEvent.change(dateReviewed, { target: { value: '2022-01-02T12:00' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Date Reviewed is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Item Id is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Reviewer Email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Stars is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Comments is required./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-cancel");
        const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


