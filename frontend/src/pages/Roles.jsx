import React from "react";
import { Tag } from "antd";
import RoleModule from "@/modules/RoleModule";
import RoleForm from "@/forms/RoleForm";
import permissions_data from "@/enums/permissions"

function Role() {
  const entity = "role";
  const searchConfig = {
    displayLabels: ["title"],
    searchFields: "name,title,permissions",
    outputValue: "_id",
  };

  const panelTitle = "Role Panel";
  const dataTableTitle = "Roles";
  const entityDisplayLabels = ["title"];

  const readColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      type: "tags",
    },
  ];
  const dataTableColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      render: permissions => (
        <>
          {permissions &&
            (permissions.map(permission => {
              return (
                <Tag color={"#2e7cbd"} style={{ marginBottom: '10px' }} key={permission}>
                  {permissions_data[permission]}
                </Tag>
              );
            })
            )
          }
        </>
      )
    },

  ];

  const ADD_NEW_ENTITY = "Add new Role";
  const DATATABLE_TITLE = "Role";
  const ENTITY_NAME = "Role";
  const CREATE_ENTITY = "Create Role";
  const UPDATE_ENTITY = "Update Role";
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
    <RoleModule
      createForm={<RoleForm />}
      updateForm={<RoleForm isUpdateForm={true} />}
      config={config}
    />
  );
}

export default Role;
