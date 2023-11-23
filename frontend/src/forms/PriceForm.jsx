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
                label="Price btc"
                name="price_btc"
                rules={[
                    {
                        required: true,
                        message: "Please input price btc!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Price usd"
                name="price_usd"
                rules={[
                    {
                        required: true,
                        message: "Please input price usd!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Price btc"
                name="date"
                rules={[
                    {
                        required: true,
                        message: "Please input date!",
                    },
                ]}
            >
                <Input />
            </Form.Item>

        </>
    );
}
