import React from "react";

import CrudModule from "@/modules/CrudModule";
import ContactForm from "@/forms/ContactForm";

export default function NewsCategory() {
    const entity = "contact";
    const searchConfig = {
        displayLabels: ["name"],
        searchFields: "name",
        outputValue: "name",
    };

    const panelTitle = "New contact";
    const dataTableTitle = "Contact List";
    const entityDisplayLabels = ["email"];

    const readColumns = [
        { title: "Name", dataIndex: "name" },
        { title: "message", dataIndex: "message" },
        { title: "email", dataIndex: "email" }
    ];

    const dataTableColumns = [
        { title: "Name", dataIndex: "name" },
        { title: "message", dataIndex: "message" },
        { title: "email", dataIndex: "email" }
    ];

    const ADD_NEW_ENTITY = "Add news Category";
    const DATATABLE_TITLE = "News Category";
    const ENTITY_NAME = "contact";
    const CREATE_ENTITY = "Create contact";
    const UPDATE_ENTITY = "Update contact";

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
            createForm={<ContactForm entity={entity} />}
            updateForm={<ContactForm isUpdateForm={true} entity={entity} />}
            config={config}
        />
    );
}
