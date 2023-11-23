import React, { useCallback, useMemo, useState } from 'react';
import { Form } from "antd";

Object.defineProperty(String.prototype, 'toCapitalize', {
    value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

export const useForceUpdate = () => {
    const [tick, setTick] = useState(0);
    return useCallback(() => {
        setTick(tick => tick + 1);
    }, []);
}

const CommonInput = React.memo((props) => {

    let msg = useMemo(() => {
        let msg = props?.hasError?.props?.children || props?.hasError || ''
        if (msg) msg = msg?.replace('The', '')?.replace('field', '')?.replace('and', '-') || ''
        return msg?.trim()?.toCapitalize() || ''
    }, [props?.hasError])

    return <Form.Item label={props?.label} required={props?.required} name={props?.label} style={props.style}>
        {props.children}
        <p style={{ color: 'red' }}>{msg}</p>
    </Form.Item>
});

export default CommonInput;
