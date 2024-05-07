const ucsbOrganizationFixtures = {
  oneUcsbOrganization: {
    orgCode: "ORG1",
    orgTranslationShort: "OG1",
    orgTranslation: "Organization 1",
    inactive: false,
  },

  threeUcsbOrganizations: [
    {
      orgCode: "ORG1",
      orgTranslationShort: "OG1",
      orgTranslation: "Organization 1",
      inactive: false,
    },
    {
      orgCode: "ORG2",
      orgTranslationShort: "OG2",
      orgTranslation: "Organization 2",
      inactive: true,
    },
    {
      orgCode: "ISFA",
      orgTranslationShort: "ISFA",
      orgTranslation: "International Students' Film Association",
      inactive: true,
    },
  ],
};

export { ucsbOrganizationFixtures };
