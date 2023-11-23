import React from "react";

import CrudModule from "@/modules/CrudModule";
import ArticleForm from "@/forms/ArticleForm";
import { Typography } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";

function Article() {
  const entity = "articles";
  const searchConfig = {
    displayLabels: ["article"],
    searchFields: "title",
    outputValue: "_id",
  };

  const panelTitle = "Article Panel";
  const dataTableTitle = "Articles";
  const entityDisplayLabels = ["article"];

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
      title: "Created At",
      dataIndex: "createdAt",
      type: "date",
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
      title: "Reports",
      dataIndex: "reports.length",
    },
    {
      title: "Comments",
      dataIndex: "comments.length",
    },
    {
      title: "Is Verified",
      dataIndex: "verified",
    },
    {
      title: "Article",
      dataIndex: "article",
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
      dataIndex: "article",
      render: (article) => (
        <>
          {article?.length > 0 ? (
            <Typography.Text>{article[0]?.title}</Typography.Text>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: "Paragraphs",
      dataIndex: "article",
      render: (article) => (
        <>
          <Typography.Text>
            {article?.reduce(
              (prevCount, value) =>
                value?.paragraph ? prevCount + 1 : prevCount,
              0
            )}
          </Typography.Text>
        </>
      ),
    },
    {
      title: "Verified",
      dataIndex: "verified",
      render: (verified) => (
        <Typography.Text>
          {verified ? "Verified" : "Not Verified"}
        </Typography.Text>
      ),
    },
    {
      title: "Views",
      dataIndex: "views",
    },
  ];

  const ADD_NEW_ENTITY = "Add new Article";
  const DATATABLE_TITLE = "Articles List";
  const ENTITY_NAME = "Article";
  const CREATE_ENTITY = "Create Article";
  const UPDATE_ENTITY = "Update Article";
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
      createForm={<ArticleForm entity={entity} />}
      updateForm={<ArticleForm isUpdateForm={true} entity={entity} />}
      config={config}
    />
  );
}

export default Article;
