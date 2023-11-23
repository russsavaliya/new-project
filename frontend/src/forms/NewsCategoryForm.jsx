import React from "react";
import { Form, Input } from "antd";

export default function NewsCategoryForm({ isUpdateForm = false }) {
    return (
        <>
            <Form.Item
                label="Name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: "Please input name!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
        </>
    );
}
