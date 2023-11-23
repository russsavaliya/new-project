import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Select } from "antd";
import { getStatesOfCountry } from "country-state-city/dist/lib/state";
import SelectUser from "@/components/UserSelect";
import CommonInput, { useForceUpdate } from "@/components/CommonInput";
import Validator from "simple-react-validator";
import moment from "moment";
import { Country } from "country-state-city";
import { crud } from "@/redux/crud/actions";
import { useDispatch, useSelector } from "react-redux";
import { selectUpdatedItem } from "@/redux/crud/selectors";

export default function TravelPlanForm({ isUpdateForm = false, entity }) {
    const initialValue = {
        user_id: '',
        tto_country: '',
        tto_state: '',
        tto_place: '',
        overview: '',
        isDeleted: false,
        activity: '',
        dot_to: '',
        dot_from: ''
    }
    const dispatch = useDispatch()
    const forceUpdate = useForceUpdate();
    const validator = useRef(new Validator({ autoForceUpdate: { forceUpdate } }));
    const [values, setValues] = useState(initialValue);
    const [statesOption, setStatesOption] = useState([]);
    const [loading, setLoading] = useState(false);
    const updatePlan = useSelector(selectUpdatedItem);
    const allCountries = Country.getAllCountries();
    const country_options = allCountries.map((country) => {
        return { label: country.name, value: country.name };
    });

    useEffect(() => {
        if (updatePlan?.current && updatePlan?.current?._id) {
            let { dot_from, dot_to } = updatePlan?.current
            dot_from = moment(dot_from).format('YYYY-MM-DD')
            dot_to = moment(dot_to).format('YYYY-MM-DD')
            setValues({ ...updatePlan?.current, dot_to, dot_from })
        }
    }, [updatePlan?.current]);


    function handleCountryChange(value) {
        if (value) {
            let country = allCountries.find((country) => country.name === value);
            handleChange(country.name, 'tto_country')
            let newStates = getStatesOfCountry(country.isoCode);
            if (newStates.length === 0) setStatesOption([{ label: country.name, value: country.name }]);
            else setStatesOption(newStates.map(state => ({ label: state.name, value: state.name })));
        }
    }

    const handleChange = (value, name) => {
        setValues({ ...values, [name]: value })
    }

    const onSubmit = () => {
        if (validator?.current?.allValid()) {
            setLoading(true)
            if (updatePlan?.current?._id) dispatch(crud.update(entity, updatePlan?.current?._id, values, '', res => {
                setLoading(false)
                if (res.success) setValues(initialValue)
            }))
            else dispatch(crud.create(entity, values, '', res => {
                setLoading(false)
                if (res.success) setValues(initialValue)
            }))
        } else validator?.current?.showMessages()
    }

    return (
        <>
            <CommonInput label="Select User" required
                hasError={validator?.current?.message("User", values?.user_id, "required")}>
                <SelectUser value={values?.user_id} onChange={handleChange} />
            </CommonInput>
            <CommonInput label="Set Deleted" required
                hasError={validator?.current?.message("Deleted Status", values?.isDeleted, "required")}>
                <Select placeholder="Set Deleted Status" value={values?.isDeleted}
                    onChange={val => handleChange(val, 'isDeleted')}>
                    <Select.Option value={false}>Not Deleted</Select.Option>
                    <Select.Option value={true}>Deleted</Select.Option>
                </Select>
            </CommonInput>
            <CommonInput label="Select Country" required
                hasError={validator?.current?.message("Country", values?.tto_country, "required")}>
                <Select
                    placeholder="Select Country"
                    filterOption={true}
                    showSearch={true}
                    optionFilterProp="label"
                    value={values?.tto_country}
                    options={country_options}
                    onChange={(e) => handleCountryChange(e)}
                />
            </CommonInput>
            <CommonInput label="Select State" required
                hasError={validator?.current?.message("State", values?.tto_state, "required")}>
                <Select
                    placeholder="Select State"
                    filterOption={true}
                    showSearch={true}
                    optionFilterProp="value"
                    value={values?.tto_state}
                    onChange={val => handleChange(val, 'tto_state')}
                    options={statesOption}
                />
            </CommonInput>
            <CommonInput label="Place Visiting" required
                hasError={validator?.current?.message("Place Visiting", values?.tto_place, "required")}>
                <Input placeholder="Place you are going to visit..." name='tto_place' value={values?.tto_place}
                    onChange={({ target: { value, name } }) => handleChange(value, name)} />
            </CommonInput>
            <div style={{ display: 'flex' }}>
                <CommonInput label="From Date" required style={{ width: '100%' }}
                    hasError={validator?.current?.message("From Date", values?.dot_from, "required")}>
                    <Input
                        name='dot_from'
                        type="date"
                        min={moment().format('YYYY-MM-DD')}
                        value={values?.dot_from}
                        onChange={({ target: { value, name } }) => handleChange(value, name)}
                    />
                </CommonInput>
                <CommonInput label="To Date" required style={{ width: '100%', paddingLeft: '5px' }}
                    hasError={validator?.current?.message("To Date", values?.dot_to, "required")}>
                    <Input
                        name='dot_to'
                        type="date"
                        min={moment(values?.dot_from).format('YYYY-MM-DD')}
                        value={values?.dot_to}
                        onChange={({ target: { value, name } }) => handleChange(value, name)}
                    />
                </CommonInput>
            </div>
            <CommonInput label="Activity" required
                hasError={validator?.current?.message("Activity", values?.activity, "required")}>
                <Input name='activity' placeholder="Add comma seperated activity like Beach, Surfing, ..."
                    value={values?.activity}
                    onChange={({ target: { value, name } }) => handleChange(value, name)} />
            </CommonInput>
            <CommonInput label="Overview" required
                hasError={validator?.current?.message("Overview", values?.overview, "required|min:5|max:1200")}>
                <Input.TextArea name='overview' placeholder="Describe Your Travel Plan" rows={4}
                    value={values?.overview}
                    onChange={({ target: { value, name } }) => handleChange(value, name)} />
            </CommonInput>

            <Button type="primary" onClick={onSubmit} loading={loading}>
                Submit
            </Button>
        </>
    );
}
