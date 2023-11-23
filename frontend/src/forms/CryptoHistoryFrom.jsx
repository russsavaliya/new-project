import React from "react";
import { Form, Input } from "antd";

export default function CryptoForm({ isUpdateForm = false }) {
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
                label="Price"
                name="current_price"
                rules={[
                    {
                        required: true,
                        message: "Please input current price!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Market cap"
                name="market_cap"
                rules={[
                    {
                        required: true,
                        message: "Please input marketcap!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
        </>
    );
}
