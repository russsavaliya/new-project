import React from "react";

import CrudModule from "@/modules/CrudModule";
import TokenForm from "@/forms/CoinDynamic";

export default function CurrentPrice() {
    const entity = "coindynamic";
    const searchConfig = {
        displayLabels: ["name"],
        searchFields: "name",
        outputValue: "name",
    };

    const panelTitle = "Crypto current price";
    const dataTableTitle = "Crypto Price List";
    const entityDisplayLabels = ["email"];

    const readColumns = [
        { title: "Rank", dataIndex: "rank" },
        { title: "Name", dataIndex: "id" },
        { title: 'Market cap', dataIndex: "market_cap" },
        { title: "Circulating supply", dataIndex: "circulating_supply" },
        { title: "Max supply", dataIndex: "max_supply" },
        { title: "Total supply", dataIndex: "total_supply" },
        { title: "Image", dataIndex: "icon", type: 'image' }
    ];

    const dataTableColumns = [
        { title: "Name", dataIndex: "id" },
        { title: 'Market cap', dataIndex: "market_cap" },
        { title: "Rank", dataIndex: "rank" },
    ];

    const ADD_NEW_ENTITY = "Crypto current price";
    const DATATABLE_TITLE = "Crypto price";
    const ENTITY_NAME = "token";
    const CREATE_ENTITY = "Create Crypto price";
    const UPDATE_ENTITY = "Update Crypto Price";

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
            createForm={<TokenForm entity={entity} />}
            updateForm={<TokenForm isUpdateForm={true} entity={entity} />}
            config={config}
        />
    );
}
