import React, { useEffect } from "react";

import CrudModule from "@/modules/CrudModule";
import PostForm from "@/forms/PostForm";
import { Typography } from "antd";
import { useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";

function Post() {
  const entity = "post";
  const searchConfig = {
    displayLabels: ["title", "desc", "tags"],
    searchFields: "title,desc,tags",
    outputValue: "_id",
  };

  const panelTitle = "Posts";
  const dataTableTitle = "Posts";
  const entityDisplayLabels = ["title"];

  const readColumns = [
    {
      title: "User",
      dataIndex: "user_id",
      type: "user",
    },
    {
      title: "Frontend Url",
      dataIndex: "_id",
      type: "front-link",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "desc",
    },
    {
      title: "Media",
      dataIndex: "media_url",
      type: "media",
    },
    {
      title: "Media Type",
      dataIndex: "media_type",
    },
    {
      title: "Views",
      dataIndex: "views",
    },
    {
      title: "Likes",
      dataIndex: "likes",
    },
    {
      title: "Comments",
      dataIndex: "comments.length",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      type: "tags",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      type: "date",
    },
  ];
  const dataTableColumns = [
    {
      title: "User",
      dataIndex: "user_id",
      render: (user) => (
        <>
          {user?._id ? (
            <Typography.Text>
              {user?.firstname + " " + user?.lastname}
            </Typography.Text>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "desc",
    },
    {
      title: "Media Type",
      dataIndex: "media_type",
    },
    {
      title: "Views",
      dataIndex: "views",
    },
    {
      title: "Tags",
      dataIndex: "tags",
    },
  ];

  const ADD_NEW_ENTITY = "Add new Post";
  const DATATABLE_TITLE = "Posts List";
  const ENTITY_NAME = "Post";
  const CREATE_ENTITY = "Create Post";
  const UPDATE_ENTITY = "Update Post";
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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(crud.resetState());
  }, []);
  return (
    <CrudModule
      createForm={<PostForm entity={entity} />}
      updateForm={<PostForm entity={entity} isUpdateForm={true} />}
      config={config}
    />
  );
}

export default Post;
