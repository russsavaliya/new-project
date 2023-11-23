import React from 'react'
import { useNews, useDispatchNews } from "@/forms/News/NewsContext"
import CommonInput from "@/components/CommonInput";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { Typography } from "antd";
import TagSelector from "@/components/TagSelector";

function StepsOfNews({ validator }) {
    const tinyRef = useRef(null);
    return (
        <React.Fragment>
            <CommonInput label={'Write overview of an article...Maximum 250 words *'}>
                <Editor
                    apiKey={'558g6bb9fhfu000ouk6syny4b8yn6xb8awmsbj1ntp8edcmb'}
                    onInit={(event, editor) => (tinyRef.current = editor)}
                    init={{
                        plugins: "link anchor, wordcount",
                        menubar: false,
                        nonbreaking_force_tab: true,
                        branding: false,
                        toolbar: "undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify" +
                            "| forecolor backcolor | bullist numlist",
                        elementpath: false,
                        content_style: 'body { font-family:Arial,sans-serif; font-size:18px; }'
                    }}
                />
            </CommonInput>
            <div style={{ margin: "10px 0 0" }}>
                <Typography.Text type="secondary" className="mb-15">
                    Maximum 5 tags allowed
                </Typography.Text>
            </div>
            <div className="mb-15">
                <TagSelector
                />
            </div>
            <Typography.Text type="danger">

            </Typography.Text>
        </React.Fragment>
    )
}

export default StepsOfNews
