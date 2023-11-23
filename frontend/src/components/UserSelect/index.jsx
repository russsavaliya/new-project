import React, { useState } from 'react';
import { Select } from "antd";
import { token as tokenCookies } from "@/auth";
import axios from "axios";

const SelectUser = React.memo((props) => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    function handleUserSearch(username) {
        const headersInstance = { [process.env.ACCESS_TOKEN_NAME]: tokenCookies.get() };
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}profile/search`, {
            params: { fields: "username", q: username },
            headers: { ...headersInstance },
        })
            .then((res) => {
                setLoading(false);
                if (res?.data?.success) {
                    const fromattedOptions = res?.data?.result?.map((user) => {
                        return { label: user.username, value: user._id };
                    });
                    setUsers(fromattedOptions);
                }
            })
            .catch((err) => {
                setLoading(false);
            });
    }

    return (
        <Select
            name="user_id"
            placeholder="Select User"
            showSearch
            onChange={(value) => props?.onChange(value, "user_id")}
            style={{ width: "100%", marginBottom: "15px" }}
            value={props?.value || null}
            onSearch={handleUserSearch}
            filterOption
            optionFilterProp="label"
            loading={loading}
            options={users}
        />
    );
});

export default SelectUser;
