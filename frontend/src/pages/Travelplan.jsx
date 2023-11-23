import React from "react";

import CrudModule from "@/modules/CrudModule";
import TravelPlanForm from "@/forms/TravelPlanForm";
import {Typography} from "antd";

function Travelplan() {
  const entity = "travelplans";
  const searchConfig = {
    displayLabels: ["tto_place","tto_state","tto_country"],
    searchFields: "tto_country,tto_state,tto_place",
    outputValue: "_id",
  };

  const panelTitle = "Travelplan Panel";
  const dataTableTitle = "Travelplans";
  const entityDisplayLabels = ["client"];

  const readColumns = [
    {
      title: "User",
      dataIndex: "user_id",
      type: "user"
    },
    {
      title: "Country",
      dataIndex: "tto_country",
    },
    {
      title: "State",
      dataIndex: "tto_state",
    },
    {
      title: "Place Visiting",
      dataIndex: "tto_place",
    },
    {
      title: "From-Date",
      dataIndex: "dot_from",
      type:'date'
    },
    {
      title: "To-Date",
      dataIndex: "dot_to",
      type:'date'
    },
    {
      title: "Activity",
      dataIndex: "activity",
    },
    {
      title: "Overview",
      dataIndex: "overview",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      type:'date'
    },
  ];
  const dataTableColumns = [
    {
      title: "User",
      dataIndex: "user_id",
      render: user => (
          <>
            {user?._id ? <Typography.Text>{user?.firstname+' '+user?.lastname}</Typography.Text> : ""}
          </>
      )
    },
    {
      title: "Country",
      dataIndex: "tto_country",
    },
    {
      title: "State",
      dataIndex: "tto_state",
    },
    {
      title: "Place Visiting",
      dataIndex: "tto_place",
    },
    {
      title: "From-Date",
      dataIndex: "dot_from",
      render: dot_from => dot_from && new Date(dot_from).toISOString().slice(0,10)
    },
    {
      title: "To-Date",
      dataIndex: "dot_to",
      render: dot_to => dot_to && new Date(dot_to).toISOString().slice(0,10)
    },
    {
      title: "Activity",
      dataIndex: "activity",
    },
  ];

  const ADD_NEW_ENTITY = "Add new Travelplan";
  const DATATABLE_TITLE = "Travelplans List";
  const ENTITY_NAME = "Travelplan";
  const CREATE_ENTITY = "Create Travelplan";
  const UPDATE_ENTITY = "Update Travelplan";
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
      createForm={<TravelPlanForm entity={entity}/>}
      updateForm={<TravelPlanForm isUpdateForm={true} entity={entity} />}
      config={config}
    />
  );
}

export default Travelplan;
