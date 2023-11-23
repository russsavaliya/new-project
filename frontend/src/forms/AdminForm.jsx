import { React, useEffect, useRef, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { crud } from "@/redux/crud/actions";
import { useSelector, useDispatch } from "react-redux";
import CommonInput, { useForceUpdate } from "@/components/CommonInput";
import Validator from "simple-react-validator";
import { request } from "@/request";
import { selectUpdatedItem } from "@/redux/crud/selectors";

export default function AdminForm({ isUpdateForm = false, entity }) {
    const initialValue = {
        email: '',
        password: '',
        role: '',
        name: '',
        surname: ''
    }
    const forceUpdate = useForceUpdate();
    let source = request.source();
    const [values, setValues] = useState(initialValue);
    const [roleOption, setRoleOption] = useState([]);
    const [loading, setLoading] = useState(false);
    const validator = useRef(new Validator({ autoForceUpdate: { forceUpdate } }));
    const updateAdmin = useSelector(selectUpdatedItem);
    const dispatch = useDispatch();

    useEffect(() => {
        if (updateAdmin?.current?._id) {
            validator?.current?.hideMessages()
            const data = { ...updateAdmin?.current }
            data.role = data?.role?.name
            setValues({ ...data })
        } else setValues(initialValue)
    }, [updateAdmin?.current]);

    const handleChange = (value, name) => {
        setValues({ ...values, [name]: value })
    }
    const onSubmit = () => {
        if (validator?.current?.allValid()) {
            validator?.current?.hideMessages()
            if (updateAdmin?.current?._id) {
                let data = { ...values }
                if (updateAdmin?.current?.role?.name === values.role) data.role = updateAdmin?.current.role._id
                dispatch(crud.update(entity, updateAdmin?.current?._id, data, '', res => {
                    setLoading(false)
                    if (res.success) setValues(initialValue)
                }))
            } else dispatch(crud.create(entity, values, '', res => {
                setLoading(false)
                if (res.success) setValues(initialValue)
            }))
        } else validator?.current?.showMessages()
    }
    const onSearch = async (value) => {
        try {
            if (value?.trim()) {
                source.cancel();
                source = request.source();
                let data = await request.search('role', source, {
                    question: value,
                    fields: 'name,title',
                });
                if (data?.success) {
                    setRoleOption(data?.result?.map((role) => ({ label: role.name, value: role._id })))
                } else setRoleOption([])
            }
        } catch (e) {
            console.log('Error in search role', e.message)
        }
    }

    validator?.current?.purgeFields()

    return (
        <>
            <CommonInput label="Email" required
                hasError={validator?.current?.message("Email", values?.email, "required|email")}>
                <Input name='email' value={values?.email} type='email'
                    onChange={({ target: { value, name } }) => handleChange(value, name)} />
            </CommonInput>
            {!updateAdmin?.current?._id && <CommonInput label="Password" required
                hasError={!updateAdmin?.current?._id &&
                    validator?.current?.message("password", values?.password, "required")}>
                <Input name='password' value={values?.password}
                    onChange={({ target: { value, name } }) => handleChange(value, name)} />
            </CommonInput>}
            <CommonInput label="Role" required
                hasError={validator?.current?.message("role", values?.role, "required")}>
                <Select
                    name="role"
                    placeholder=""
                    showSearch
                    onChange={(value) => handleChange(value, "role")}
                    value={values?.role}
                    onSearch={onSearch}
                    filterOption
                    optionFilterProp="label"
                    options={roleOption}
                />
            </CommonInput>
            <CommonInput label="First Name" required
                hasError={validator?.current?.message("name", values?.name, "required")}>
                <Input name='name' value={values?.name}
                    onChange={({ target: { value, name } }) => handleChange(value, name)} />
            </CommonInput>
            <CommonInput label="Last Name" required
                hasError={validator?.current?.message("last names", values?.surname, "required")}>
                <Input name='surname' value={values?.surname}
                    onChange={({ target: { value, name } }) => handleChange(value, name)} />
            </CommonInput>
            <Button type="primary" onClick={onSubmit} loading={loading}>
                Submit
            </Button>
        </>
    );
}
