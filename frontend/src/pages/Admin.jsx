import React from "react";

import AdminCrudModule from "@/modules/AdminCrudModule";
import AdminForm from "@/forms/AdminForm";
import { Typography } from "antd";

export default function Admin() {
    const entity = "admin";
    const searchConfig = {
        displayLabels: ["name", "surname"],
        searchFields: "email,name,surname",
        outputValue: "_id",
    };

    const panelTitle = "Admins";
    const dataTableTitle = "Admin List";
    const entityDisplayLabels = ["email"];

    const readColumns = [
        { title: "Name", dataIndex: "name" },
        { title: "Surname", dataIndex: "surname" },
        { title: "Email", dataIndex: "email" },
        { title: "Role", dataIndex: "role", type: "role" },
    ];

    const dataTableColumns = [
        { title: "Name", dataIndex: "name" },
        { title: "Surname", dataIndex: "surname" },
        { title: "Email", dataIndex: "email" },
        {
            title: "Role",
            dataIndex: "role",
            render: (role) => (
                <Typography.Text>
                    {role?.name || '-'}
                </Typography.Text>
            ),
        },
    ];
    const ADD_NEW_ENTITY = "Add new admin";
    const DATATABLE_TITLE = "Admins";
    const ENTITY_NAME = "admin";
    const CREATE_ENTITY = "Create admin";
    const UPDATE_ENTITY = "Update admin";

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
        <AdminCrudModule
            createForm={<AdminForm entity={entity} />}
            updateForm={<AdminForm isUpdateForm={true} entity={entity} />}
            config={config}
        />
    );
}
