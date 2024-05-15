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
public class UCSBOrganizationWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_orgs() throws Exception {
        setupUser(true);

        page.getByText("UCSBOrganization").click();

        page.getByText("Create Organization").click();
        assertThat(page.getByText("Create New UCSB Organization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-orgCode").fill("ORG1");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("Organization 1");
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("ORG1");
        page.getByTestId("UCSBOrganizationForm-inactive").selectOption("false");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslation"))
                .hasText("Organization 1");
        
    }

    @Test
    public void regular_user_cannot_create_orgs() throws Exception {
        setupUser(false);

        page.getByText("UCSBOrganization").click();

        assertThat(page.getByText("Create Organization")).not().isVisible();
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslation")).not().isVisible();
    }
}