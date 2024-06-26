import React from 'react';
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable"
import { ucsbOrganizationFixtures } from 'fixtures/ucsbOrganizationFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBOrganization/UCSBOrganizationTable',
    component: UCSBOrganizationTable
};

const Template = (args) => {
    return (
        <UCSBOrganizationTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    dates: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    orgs: ucsbOrganizationFixtures.threeUcsbOrganizations,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    orgs: ucsbOrganizationFixtures.threeUcsbOrganizations,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/UCSBOrganization', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

