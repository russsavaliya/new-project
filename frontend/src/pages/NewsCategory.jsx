import React from "react";

import CrudModule from "@/modules/CrudModule";
import NewsCategoryForm from "@/forms/NewsCategoryForm";

export default function NewsCategory() {
    const entity = "newscategory";
    const searchConfig = {
        displayLabels: ["name"],
        searchFields: "name",
        outputValue: "name",
    };

    const panelTitle = "News Category";
    const dataTableTitle = "News Category List";
    const entityDisplayLabels = ["email"];

    const readColumns = [
        { title: "Name", dataIndex: "name" }
    ];

    const dataTableColumns = [
        { title: "Name", dataIndex: "name" }
    ];

    const ADD_NEW_ENTITY = "Add news Category";
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
            createForm={<NewsCategoryForm entity={entity} />}
            updateForm={<NewsCategoryForm isUpdateForm={true} entity={entity} />}
            config={config}
        />
    );
}
