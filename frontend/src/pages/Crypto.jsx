import React from "react";

import CrudModule from "@/modules/CrudModule";
import CryptoForm from "@/forms/CryptoFrom";

export default function Admin() {
    const entity = "crypto";
    const searchConfig = {
        displayLabels: ["name"],
        searchFields: "name",
        outputValue: "_id",
    };

    const panelTitle = "Crypto";
    const dataTableTitle = "Crypto List";
    const entityDisplayLabels = ["email"];

    const readColumns = [
        { title: "Image", dataIndex: "image", type: 'image' },
        { title: "Name", dataIndex: "name" },
        { title: "Price", dataIndex: "current_price" },
        { title: "Market cap", dataIndex: "market_cap" }
    ];

    const dataTableColumns = [
        { title: "Name", dataIndex: "name" },
        { title: "Price", dataIndex: "current_price" },
        { title: "Market cap", dataIndex: "market_cap" },
        { title: "Market rank", dataIndex: "market_cap_rank" }
    ];
    const ADD_NEW_ENTITY = "Add new crypto";
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
        <CrudModule
            createForm={<CryptoForm entity={entity} />}
            updateForm={<CryptoForm isUpdateForm={true} entity={entity} />}
            config={config}
        />
    );
}
