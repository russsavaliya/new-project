
import React from "react";

import CrudModule from "@/modules/CrudModule";
import PriceForm from "@/forms/PriceForm";

export default function Price() {
    const entity = "price";
    const searchConfig = {
        displayLabels: ["name"],
        searchFields: "name",
        outputValue: "name",
    };

    const panelTitle = "Crypto price";
    const dataTableTitle = "Crypto Price List";
    const entityDisplayLabels = ["name"];

    const readColumns = [
        { title: "Price usd", dataIndex: "price_usd" },
        { title: "Name", dataIndex: "name" },
        { title: "Price btc", dataIndex: "price_btc" },
        { title: "Date", dataIndex: "date" },
        { title: "Image", dataIndex: "image", type: "image" }
    ];

    const dataTableColumns = [
        { title: "Name", dataIndex: "name" },
        { title: "Price btc", dataIndex: "price_btc" },
        { title: "Date", dataIndex: "date" },
        { title: "Price usd", dataIndex: "price_usd" }
    ];

    const ADD_NEW_ENTITY = "Add price";
    const DATATABLE_TITLE = "Add Price";
    const ENTITY_NAME = "price";
    const CREATE_ENTITY = "Create price";
    const UPDATE_ENTITY = "Update price";

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
            createForm={<PriceForm entity={entity} />}
            updateForm={<PriceForm isUpdateForm={true} entity={entity} />}
            config={config}
        />
    );
}

