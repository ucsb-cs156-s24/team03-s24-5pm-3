package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_recommendationrequest() throws Exception {
        setupUser(true);

        page.getByText("Recommendation Request").click();

        page.getByText("Create RecommendationRequest").click();
        assertThat(page.getByText("Create New Recommendation Request")).isVisible();
        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("me@gmail.com");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("you@gmail.com");
        page.getByTestId("RecommendationRequestForm-explanation").fill("I need a recommendation");
        page.getByTestId("RecommendationRequestForm-dateRequested").fill("2022-01-01T00:00:00");
        page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2022-01-02T00:00:00");
        page.getByTestId("RecommendationRequestForm-done").selectOption("true");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("me2@gmail.com");
        
        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit RecommendationRequest")).isVisible();
        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("me2@gmail.com");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("me2@gmail.com");
        
        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_recommendationrequest() throws Exception {
        setupUser(false);

        page.getByText("Recommendation Request").click();

        assertThat(page.getByText("Create RecommendationRequest")).not().isVisible();
        assertThat(page.getByText("Edit RecommendationRequest")).not().isVisible();
    }
}