import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { useCrudContext } from "@/context/crud";
import { selectUpdatedItem } from "@/redux/crud/selectors";

import { Button, Form } from "antd";
import Loading from "@/components/Loading";

export default function UpdateForm({ config, formElements }) {
  let { entity } = config;
  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);

  const { state, crudContextAction } = useCrudContext();
  const { panel, collapsedBox, readBox } = crudContextAction;

  const [form] = Form.useForm();

  const onSubmit = (fieldsValue) => {
    if (fieldsValue) {
      if (fieldsValue.birthday) {
        fieldsValue = {
          ...fieldsValue,
          birthday: fieldsValue["birthday"].format("DD/MM/YYYY"),
        };
      }
      if (fieldsValue.date) {
        fieldsValue = {
          ...fieldsValue,
          birthday: fieldsValue["date"].format("DD/MM/YYYY"),
        };
      }
    }

    const id = current._id;
    dispatch(crud.update(entity, id, fieldsValue));
  };
  useEffect(() => {
    if (current) {
      if (current.birthday) {
        current.birthday = dayjs(current.birthday);
      }
      if (current.date) {
        current.date = dayjs(current.date);
      }
      if (current.dot_from) {
        current.dot_from = new Date(current.dot_from).toISOString().slice(0, 10);
        current.dot_to = new Date(current.dot_to).toISOString().slice(0, 10);
      }
      if (current.date) {
        current.date = dayjs(current.date);
      }
      form.setFieldsValue(current);
    }
  }, [current]);

  function handleValueChange(changedValues, allValues) {
    if (changedValues?.tto_country) {
      form.setFieldsValue({ tto_state: null });
    }
  }

  useEffect(() => {
    if (isSuccess) {
      readBox.open();
      collapsedBox.open();
      panel.open();
      form.resetFields();
      dispatch(crud.resetAction("update"));
      dispatch(crud.list(entity));
    }
  }, [isSuccess]);

  const { isEditBoxOpen } = state;

  const show = isEditBoxOpen
    ? { display: "block", opacity: 1 }
    : { display: "none", opacity: 0 };

  return (
    <div style={show}>
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onValuesChange={handleValueChange} onFinish={onSubmit}>
          {formElements}
          <Form.Item hidden={entity === "articles" || entity === "post" || entity === "profile" || entity === "travelplans" || entity === "admin" || entity === "news"}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}
