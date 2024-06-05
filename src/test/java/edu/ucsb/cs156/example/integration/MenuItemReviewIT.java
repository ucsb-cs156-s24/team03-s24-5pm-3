package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewIT {
        @Autowired
        public CurrentUserService currentUserService;

        @Autowired
        public GrantedAuthoritiesService grantedAuthoritiesService;

        @Autowired
        MenuItemReviewRepository menuItemReviewRepository;

        @Autowired
        public MockMvc mockMvc;

        @Autowired
        public ObjectMapper mapper;

        @MockBean
        UserRepository userRepository;

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_menu_item_review() throws Exception {
                // arrange

                LocalDateTime ldt2 = LocalDateTime.parse("2022-01-03T00:00:00");


                MenuItemReview menuItemReview1 = MenuItemReview.builder()
                                .itemID(1)
                                .reviewerEmail("test")
                                .stars(5)
                                .dateReviewed(ldt2)
                                .comments("good")
                                .build();

                // act
                MvcResult response = mockMvc.perform(
                        post("/api/menuitemreview/post")
                        .param("itemID", "1")
                        .param("reviewerEmail", "test")
                        .param("stars", "5")
                        .param("dateReviewed", "2022-01-03T00:00:00")
                        .param("comments", "good")
                        .with(csrf()))
                        .andExpect(status().isOk()).andReturn()
                        .andExpect(jsonPath("$.itemID", is(1)));

                // assert
                System.out.println(response.getResponse().getContentAsString());
                System.out.println(response.getResolvedException());   
                String expectedJson = mapper.writeValueAsString(menuItemReview1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // @WithMockUser(roles = { "USER" })
        // @Test
        // public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
        //         // arrange

        //         LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

        //         MenuItemReview menuItemReview = MenuItemReview.builder()
        //                         .itemID(1)
        //                         .reviewerEmail("reviewer@gmail.com")
        //                         .stars(5)
        //                         .dateReviewed(ldt1)
        //                         .comments("good")
        //                         .build();
                                
        //         menuItemReviewRepository.save(menuItemReview);

        //         // act
        //         MvcResult response = mockMvc.perform(get("/api/menuitemreview?id=1"))
        //                         .andExpect(status().isOk()).andReturn();

        //         // assert
        //         String expectedJson = mapper.writeValueAsString(menuItemReview);
        //         String responseString = response.getResponse().getContentAsString();
        //         assertEquals(expectedJson, responseString);
        // }
}
