import React from "react";
import { Form, Input, Select, Button } from "antd";
const { TextArea } = Input;
import communities_data from "@/enums/communities";
import socials_data from "@/enums/socials";
const options = Object.entries(communities_data).map((perm) => { return { "label": perm[1], "value": perm[0] } });
const socialsoptions = Object.entries(socials_data).map((perm) => { return { "label": perm[1], "value": perm[0] } });
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 },
    },
};

export default function TokenDynamic({ isUpdateForm = false }) {
    return (
        <>
            <Form.Item
                label="title"
                name="title"
                rules={[
                    {
                        required: true,
                        message: "Please input title",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="shortname"
                name="shortname"
                rules={[
                    {
                        required: true,
                        message: "Please input shortname!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                rules={[
                    {
                        required: true,
                        message: "Please input description!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Website"
                name="website"
                rules={[
                    {
                        required: true,
                        message: "Please input websitename!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="whitepaper"
                name="whitepaper"
                rules={[
                    {
                        required: true,
                        message: "Please input whitepaper!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Sulg"
                name="slug"
                rules={[
                    {
                        required: true,
                        message: "Please input slug!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="contracts"
                name="contracts"
                rules={[
                    {
                        required: true,
                        message: "Please input contracts!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.List
                name="explorers"
                rules={[
                    {
                        validator: async (_, explorers) => {
                            if (!explorers || explorers.length < 2) {
                                return Promise.reject(new Error('At least 2 explorers'));
                            }
                        },
                    },
                ]}
            >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <Form.Item
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                label={index === 0 ? 'explorers' : ''}
                                required={false}
                                key={field.key}
                            >
                                <Form.Item
                                    {...field}
                                    validateTrigger={['onChange', 'onBlur']}
                                    rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: "Please input explore's name or delete this field.",
                                        },
                                    ]}
                                    noStyle
                                >
                                    <Input placeholder="explorers name" style={{ width: '100%' }} />
                                </Form.Item>
                                {fields.length > 1 ? (
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        onClick={() => remove(field.name)}
                                    />
                                ) : null}
                            </Form.Item>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                style={{ width: '100%' }}
                                icon={<PlusOutlined />}
                            >
                                Add explorers field
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item
                label="tags"
                name="tags"
                rules={[
                    {
                        required: true,
                        message: "Please input tags!",
                    },
                ]}
            >
                <Select mode="tags" style={{ width: '100%' }} placeholder="Tags Mode">
                </Select>
            </Form.Item>
            <Form.Item
                name="communities"
                label="Communities"
                rules={[
                    {
                        required: true,
                        message: "Please select communities!",
                    },
                ]}
            >
                <Select mode="multiple" allowClear optionFilterProp="label" options={options} />
            </Form.Item>
            <Form.Item
                name="socials"
                label="Socials"
                rules={[
                    {
                        required: true,
                        message: "Please select socials!",
                    },
                ]}
            >
                <Select mode="multiple" allowClear optionFilterProp="label" options={socialsoptions} />
            </Form.Item>
            <Form.List
                name="chat"
                rules={[
                    {
                        validator: async (_, chat) => {
                            if (!chat || chat.length < 2) {
                                return Promise.reject(new Error('At least 2 passengers'));
                            }
                        },
                    },
                ]}
            >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <Form.Item
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                label={index === 0 ? 'Passengers' : ''}
                                required={false}
                                key={field.key}
                            >
                                <Form.Item
                                    {...field}
                                    validateTrigger={['onChange', 'onBlur']}
                                    rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: "Please input passenger's name or delete this field.",
                                        },
                                    ]}
                                    noStyle
                                >
                                    <Input placeholder="passenger name" style={{ width: '100%' }} />
                                </Form.Item>
                                {fields.length > 1 ? (
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        onClick={() => remove(field.name)}
                                    />
                                ) : null}
                            </Form.Item>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                style={{ width: '100%' }}
                                icon={<PlusOutlined />}
                            >
                                Add chat field
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </>
    );
}

