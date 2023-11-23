import React from "react";

import CrudModule from "@/modules/CrudModule";
import NewsForm from "@/forms/NewsForm";
import { Typography } from "antd";

function News() {
    const entity = "news";
    const searchConfig = {
        displayLabels: ["title"],
        searchFields: "title",
        outputValue: "_id",
    };

    const panelTitle = "News";
    const dataTableTitle = "News";
    const entityDisplayLabels = ["title"];

    const readColumns = [
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Content",
            dataIndex: "content",
            type: "content"
        },
        {
            title: "Author",
            dataIndex: "author",
        },
        {
            title: "Tags",
            dataIndex: "tags",
            type: "tags"
        },
        {
            title: "Meta discription",
            dataIndex: "meta_description"
        },
        {
            title: "Image",
            dataIndex: "news_picture_url",
            type: "image"
        }
    ];
    const dataTableColumns = [
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Author",
            dataIndex: "author",
        },
        {
            title: "Category",
            dataIndex: "category_id",
            render: (category_id) => (
                <>
                    {category_id?._id ? (
                        <Typography.Text>
                            {category_id?.name}
                        </Typography.Text>
                    ) : (
                        ""
                    )}
                </>
            ),
        },
    ];

    const ADD_NEW_ENTITY = "Add new news";
    const DATATABLE_TITLE = "News List";
    const ENTITY_NAME = "News";
    const CREATE_ENTITY = "Create News";
    const UPDATE_ENTITY = "Update News";
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
            createForm={<NewsForm entity={entity} />}
            updateForm={<NewsForm isUpdateForm={true} entity={entity} />}
            config={config}
        />
    );
}

export default News;
