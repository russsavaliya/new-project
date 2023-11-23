import React from "react";
import { Form, Input, Select } from "antd";
import { DatePicker } from "@/components/CustomAntd";
import permissions_data from "@/enums/permissions";
const options = Object.entries(permissions_data).map((perm) => { return { "label": perm[1], "value": perm[0] } });

export default function RoleForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input role name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="title"
        label="Title"
        rules={[
          {
            required: true,
            message: "Please input role title!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="permissions"
        label="Permissions"
        rules={[
          {
            required: true,
            message: "Please select permissions!",
          },
        ]}
      >
        <Select mode="multiple" allowClear optionFilterProp="label" options={options} />
      </Form.Item>
    </>
  );
}
