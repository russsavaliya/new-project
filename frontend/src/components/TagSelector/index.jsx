import React, { useEffect, useMemo, useState } from 'react';
import CreatableSelect from "react-select/creatable";
import useDebouncedEffect from "use-debounced-effect";
import { token as tokenCookies } from "@/auth";
import axios from "axios";

const TagSelector = React.memo((props) => {
    const [inputValue, setInputValue] = useState('');
    const [tagValue, setTagValue] = useState([]);
    const [tagOption, setTagOption] = useState([]);
    const handleTagChange = (value, actionMeta) => {
        console.log(value, "valluedsafdsa");
        if (props.onChange) props.onChange(value.map(data => data.value).toString() || '')
        setTagValue(value)
    };
    const handleInputChange = (val) => {
        if (tagValue?.length > 5) return
        if (val && val.endsWith(",")) {
            const label = val.slice(0, -1);
            const newValue = { label, value: label };
            setTagValue([...tagValue, newValue]);
            setInputValue('')
        } else setInputValue(val)
    };
    const fetchTags = (tag) => {
        const headersInstance = { [process.env.REACT_APP_ACCESS_TOKEN_NAME]: tokenCookies.get() };
        if (tag.length > 0) {
            axios.post(`${process.env.REACT_APP_API_BASE_URL}get/tags`, { tag }, { headers: { ...headersInstance } })
                .then((res) => {
                    if (res?.status === 404) {
                        alert("Could not connect to server.");
                    } else if (res?.status === 200) {
                        if (res?.data?.tag_list) {
                            setTagOption(res.data.tag_list.map(tag => (
                                { value: tag.tag_name, label: tag.tag_name }
                            )
                            ));
                        }
                    }
                })
                .catch((err) => {
                    console.log(err.message, "dsfads");
                });
        }
    }

    useEffect(() => {
        fetchTags('')
    }, []);

    // useEffect(() => {
    //     if (props?.value) setTagValue(props?.value.split(',').map(label => label && { label, value: label }) || [])
    //     else setTagValue([])
    // }, [props?.value]);

    useDebouncedEffect(() => {
        fetchTags(inputValue || '')
    }, 200, [inputValue]);
    return <>
        <CreatableSelect
            name={'tags'}
            inputValue={inputValue}
            isMulti
            isClearable
            placeholder="Enter some tags"
            value={tagValue}
            onChange={handleTagChange}
            onInputChange={handleInputChange}
            options={tagValue.length < 5 ? tagOption : []}
            isValidNewOption={(value) => value?.length > 2 && tagValue.length < 5}
        />

    </>

});

export default TagSelector;
