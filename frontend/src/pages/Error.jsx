import React from "react";

import CrudModule from "@/modules/CrudModule";
import NewsCategoryForm from "@/forms/NewsCategoryForm";

export default function Error() {
    const entity = "error";
    const searchConfig = {
        displayLabels: ["name"],
        searchFields: "name",
        outputValue: "name",
    };

    const panelTitle = "Error";
    const dataTableTitle = "Error List";
    const entityDisplayLabels = ["email"];

    const readColumns = [
        { title: "ErrorName", dataIndex: "errorText" },
        { title: "ErrorStatusCode", dataIndex: "errorStatus" },
        { title: "ErrorDateAndTime", dataIndex: "errorDateAndTime" },
        { title: "ErrorUrl", dataIndex: "errorUrl" }
    ];

    const dataTableColumns = [
        { title: "ErrorName", dataIndex: "errorText" },
        { title: "ErrorStatusCode", dataIndex: "errorStatus" },
        { title: "ErrorDateAndTime", dataIndex: "errorDateAndTime" }
    ];

    const DATATABLE_TITLE = "News Category";
    const ENTITY_NAME = "admin";
    const CREATE_ENTITY = "Create category";
    const UPDATE_ENTITY = "Update Category";

    const config = {
        entity,
        panelTitle,
        dataTableTitle,
        ENTITY_NAME,
        CREATE_ENTITY,
        UPDATE_ENTITY,
        DATATABLE_TITLE,
        readColumns,
        dataTableColumns,
        searchConfig,
        entityDisplayLabels,
    };
    return (
        <CrudModule
            config={config}
        />
    );
}
