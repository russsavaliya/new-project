import React from "react";
import { Tag } from "antd";
import CrudModule from "@/modules/CrudModule";
import CoinStaticForm from "@/forms/CoinStatic";
import communities_data from "@/enums/communities"
import socials_data from "@/enums/socials"

export default function TokenStatic() {
    const entity = "coinstatic";
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
        { title: 'Market cap', dataIndex: "market_cap" },
        { title: "Circulating supply", dataIndex: "circulating_supply" },
        { title: "Max supply", dataIndex: "max_supply" },
        { title: "Image", dataIndex: "icon", type: 'image' },
        { title: "title", dataIndex: "title" },
        { title: "description", dataIndex: "description" },
        { title: "Tags", dataIndex: "tags" },
        { title: "chat", dataIndex: "chat" },
        { title: "explorers", dataIndex: "explorers" },
        { title: "whitepaper", dataIndex: "whitepaper" },
        { title: "website", dataIndex: "website" },
        { title: "shortname", dataIndex: "shortname" },
        { title: "contracts", dataIndex: "contracts" },
        { title: "socials", dataIndex: "socials" },
        {
            title: "Communities",
            dataIndex: "communities",
            render: communities => (
                <>
                    {communities &&
                        (communities.map(communities => {
                            return (
                                <Tag color={"#2e7cbd"} style={{ marginBottom: '10px' }} key={communities}>
                                    {communities_data[communities]}
                                </Tag>
                            );
                        })
                        )
                    }
                </>
            )
        },
        {
            title: "Socials",
            dataIndex: "socials",
            render: communities => (
                <>
                    {communities &&
                        (communities.map(communities => {
                            return (
                                <Tag color={"#2e7cbd"} style={{ marginBottom: '10px' }} key={communities}>
                                    {socials_data[communities]}
                                </Tag>
                            );
                        })
                        )
                    }
                </>
            )
        },
    ];

    const dataTableColumns = [
        { title: 'Market cap', dataIndex: "market_cap" },
        { title: "Name", dataIndex: "id" },
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
            createForm={<CoinStaticForm entity={entity} />}
            updateForm={<CoinStaticForm isUpdateForm={true} entity={entity} />}
            config={config}
        />
    );
}
