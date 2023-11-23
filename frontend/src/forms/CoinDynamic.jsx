import React from "react";
import { Form, Input } from "antd";
const { TextArea } = Input;
export default function TokenStatic({ isUpdateForm = false }) {
    return (
        <>
            <Form.Item
                label="last price usd"
                name="last_price_usd"
                rules={[
                    {
                        required: true,
                        message: "Please input last price usd!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="last price btc"
                name="last_price_btc"
                rules={[
                    {
                        required: true,
                        message: "Please input last price btc!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Circulating supply"
                name="circulating_supply"
                rules={[
                    {
                        required: true,
                        message: "Please input circulating supply!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Max supply"
                name="max_supply"
                rules={[
                    {
                        required: true,
                        message: "Please input max supply!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="volume 24 hours"
                name="volume_24_hours"
                rules={[
                    {
                        required: true,
                        message: "Please input volume 24 hours!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="volume 7 hours"
                name="volume_7_days"
                rules={[
                    {
                        required: true,
                        message: "Please input volume 7 days!",
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
            <Form.Item
                label="rank"
                name="rank"
                rules={[
                    {
                        required: true,
                        message: "Please input rank!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
        </>
    );
}
