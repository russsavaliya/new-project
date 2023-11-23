import React, {useEffect, useState, useRef} from "react";

import {AutoComplete, Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {useSelector, useDispatch} from "react-redux";
import {crud} from "@/redux/crud/actions";
import {request} from "@/request";
import {useCrudContext} from "@/context/crud";
import {selectSearchedItems} from "@/redux/crud/selectors";
import {Empty} from "antd";
import useDebouncedEffect from "use-debounced-effect";

export default function SearchItem({config}) {
    let {entity, searchConfig} = config;

    const {displayLabels, searchFields, outputValue = "_id"} = searchConfig;
    const dispatch = useDispatch();
    const [value, setValue] = useState("");
    const [searchText, setSearchText] = useState('');
    const [options, setOptions] = useState([]);
    const searchRef = useRef(null);
    const {crudContextAction} = useCrudContext();
    const {panel, collapsedBox, readBox} = crudContextAction;

    let source = request.source();
    const {result, isLoading, isSuccess} = useSelector(selectSearchedItems);

    useEffect(() => {
        isLoading && setOptions([{label: "... Searching"}]);
    }, [isLoading]);
    useEffect(() => {
        const keyHandler = (e) => {
            if (e.keyCode === 75 && e.ctrlKey) {
                e.preventDefault()
                searchRef?.current?.focus()
            }
        }
        document.addEventListener('keydown',keyHandler)
        return () => document.removeEventListener('keydown',keyHandler)
    }, []);


    useDebouncedEffect(() => {
        if (searchText.trim()) {
            dispatch(crud.search(entity, source, {
                question: searchText,
                fields: searchFields,
            }));
        }
    }, 300, [searchText]);

    const onSearch = (searchText) => {
        setSearchText(searchText)
    };

    const onSelect = async (_id) => {
        dispatch(crud.read(entity, _id))
        panel.open();
        collapsedBox.open();
        readBox.open();
    };

    const onChange = (data) => {
        const currentItem = options.find((item) => {
            return item.value === data;
        });
        const currentValue = currentItem ? currentItem.label : data;
        setValue(currentValue);
    };

    useEffect(() => {
        let optionResults = [];

        result.map((item) => {
            let labels = displayLabels.map((x) => {
                if (x === 'article') return item[x]?.[0]?.title
                return item[x]
            }).join(" ");

            optionResults.push({label: labels, value: item[outputValue]});
        });

        setOptions(optionResults);
    }, [result]);

    return (
        <AutoComplete
            ref={searchRef}
            value={value}
            options={options}
            style={{
                width: "100%",
            }}
            onSelect={onSelect}
            onSearch={onSearch}
            onChange={onChange}
            notFoundContent={!isSuccess ? <Empty/> : ""}
            allowClear={true}
            placeholder="Your Search here (Ctrl+k)"
        >
            <Input suffix={<SearchOutlined/>}/>
        </AutoComplete>
    );
}
