import React from "react";

import CustomCrudModule from "@/modules/CustomCrudModule";
import PostForm from "@/forms/PostForm";

function SelectPost() {
  const entity = "post";
  const searchConfig = {
    displayLabels: ["title", "desc", "tags"],
    searchFields: "title,desc,tags",
    outputValue: "_id",
  };

  const panelTitle = "SelectPost Panel";
  const dataTableTitle = "posts Lists";
  const entityDisplayLabels = ["company"];

  const readColumns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Tags",
      dataIndex: "tags",
    }
  ];
  const dataTableColumns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Tags",
      dataIndex: "tags",
    },
  ];

  const ADD_NEW_ENTITY = "Add new post";
  const DATATABLE_TITLE = "posts List";
  const ENTITY_NAME = "post";
  const CREATE_ENTITY = "Create post";
  const UPDATE_ENTITY = "Update post";
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
    <CustomCrudModule
      createForm={<PostForm />}
      updateForm={<PostForm isUpdateForm={true} />}
      config={config}
    />
  );
}

export default SelectPost;
