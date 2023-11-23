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
            <Form.Item
                label="email"
                name="email"
                rules={[
                    {
                        required: true,
                        message: "Please input email!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="message"
                name="message"
                rules={[
                    {
                        required: true,
                        message: "Please input message!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
        </>
    );
}
