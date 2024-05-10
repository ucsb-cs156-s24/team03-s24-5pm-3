const recommendationRequestFixtures = {
  oneRecommendationRequest:
  [
    {
     "id": 1,
      "requesterEmail": "tmcanepa@ucsb.edu",
      "professorEmail": "phconrad@ucsb.edu",
      "explanation": "For Job Application",
      "dateRequested": "2022-01-02T12:00:00",
      "dateNeeded": "2022-01-03T12:00:00",
      "done": false,
    }
  ],

  threeRecommendationRequest:
  [
    {
      "id": 2,
       "requesterEmail": "canaya@ucsb.edu",
       "professorEmail": "phconrad@ucsb.edu",
       "explanation": "For Job Application",
       "dateRequested": "2022-02-02T12:00:00",
       "dateNeeded": "2022-03-03T12:00:00",
       "done": false,
     },

     {
      "id": 3,
       "requesterEmail": "dlam@ucsb.edu",
       "professorEmail": "phconrad@ucsb.edu",
       "explanation": "For Job Application",
       "dateRequested": "2022-11-02T12:00:00",
       "dateNeeded": "2022-12-03T12:00:00",
       "done": false,
     },

     {
      "id": 4,
       "requesterEmail": "bwalters@ucsb.edu",
       "professorEmail": "phconrad@ucsb.edu",
       "explanation": "For Job Application",
       "dateRequested": "2022-01-07T12:00:00",
       "dateNeeded": "2022-01-09T12:00:00",
       "done": false,
     }
      
  ]
};

export { recommendationRequestFixtures };