import React from "react";

import CrudModule from "@/modules/CrudModule";
import ProfileForm from "@/forms/ProfileForm";

function Profile() {
  const entity = "profile";
  const searchConfig = {
    displayLabels: ["username"],
    searchFields: "username",
    outputValue: "_id",
  };

  const panelTitle = "Profiles";
  const dataTableTitle = "Profiles";
  const entityDisplayLabels = ["ProfileName"];

  const readColumns = [
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "First Name",
      dataIndex: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Display Name",
      dataIndex: "displayname",
    },
    {
      title: "Profile Picture",
      dataIndex: "profile_picture_url",
      type: 'image'
    },
    {
      title: "Profile Banner",
      dataIndex: "profile_banner_url",
      type: 'image'
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Bio",
      dataIndex: "bio",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Country",
      dataIndex: "country",
    },
    {
      title: "City",
      dataIndex: "city",
    },
    {
      title: "Date of birth",
      dataIndex: "dob",
      type: 'date'
    },
    {
      title: "Interests",
      dataIndex: "interests",
    },
    {
      title: "Facebook",
      dataIndex: "facebook_link",
    },
    {
      title: "Blog",
      dataIndex: "blog_link",
    },
    {
      title: "YouTube",
      dataIndex: "youtube_link",
    },
    {
      title: "Instagram",
      dataIndex: "instagram_link",
    },
    {
      title: "Activity Score",
      dataIndex: "activity_score",
    },
    {
      title: "Travel Points",
      dataIndex: "travel_points",
    },
    {
      title: "Post Count",
      dataIndex: "posts_count",
    },

    {
      title: "Application Status",
      dataIndex: "application_status",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      type: 'date'
    },
  ];
  const dataTableColumns = [
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "First Name",
      dataIndex: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Display Name",
      dataIndex: "displayname",
    },

  ];

  const ADD_NEW_ENTITY = "Add new Profile";
  const DATATABLE_TITLE = "Profiles List";
  const ENTITY_NAME = "Profile";
  const CREATE_ENTITY = "Create Profile";
  const UPDATE_ENTITY = "Update Profile";
  const config = {
    entity,
    panelTitle,
    dataTableTitle,
    ENTITY_NAME,
    CREATE_ENTITY,
    ADD_NEW_ENTITY,
    UPDATE_ENTITY,
    DATATABLE_TITLE,
    readColumns,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return (
    <CrudModule
      createForm={<ProfileForm entity={entity} />}
      updateForm={<ProfileForm isUpdateForm={true} entity={entity} />}
      config={config}
    />
  );
}

export default Profile;
