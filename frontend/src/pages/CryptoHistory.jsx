
import React from "react";

import CrudModule from "@/modules/CrudModule";
import CryptoForm from "@/forms/CryptoHistoryFrom";

export default function CryptoHistory() {
    const entity = "cryptohistory";
    const searchConfig = {
        displayLabels: ["name"],
        searchFields: "name",
        outputValue: "_id",
    };

    const panelTitle = "Crypto";
    const dataTableTitle = "Crypto List";
    const entityDisplayLabels = ["email"];

    const readColumns = [
        { title: "Name", dataIndex: "name" },
        { title: "Date", dataIndex: "date" },
        { title: "Current Price", dataIndex: "current_price" },
        { title: "Image", dataIndex: "image", type: 'image' },
        { title: "Marketcap", dataIndex: "market_cap" }
    ];

    const dataTableColumns = [
        { title: "Name", dataIndex: "name" },
        { title: "Date", dataIndex: "date" },
        { title: "Current Price", dataIndex: "current_price" },
        { title: "Marketcap", dataIndex: "market_cap" }
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
