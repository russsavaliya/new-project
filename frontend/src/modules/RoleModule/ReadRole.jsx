import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Button, Image, Tag } from "antd";
import { useSelector } from "react-redux";

import { useCrudContext } from "@/context/crud";
import { selectCurrentItem } from "@/redux/crud/selectors";
import { valueByString } from "@/utils/helpers";
import permissions_data from "@/enums/permissions"

export default function ReadItem({ config }) {
  let { readColumns } = config;
  const { result: currentResult } = useSelector(selectCurrentItem);
  const { state } = useCrudContext();
  const { isReadBoxOpen } = state;
  const [listState, setListState] = useState([]);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const list = [];
    readColumns.map((props) => {
      const propsKey = props.dataIndex;
      const propsTitle = props.title;
      const propsType = props.type ? props.type : 'text';
      const value = valueByString(currentResult, propsKey);
      list.push({ propsKey, label: propsTitle, value: value, type: propsType });
    });
    setListState(list);
  }, [currentResult]);

  const show = isReadBoxOpen
    ? { display: "block", opacity: 1 }
    : { display: "none", opacity: 0 };

  const itemsList = listState.map((item) => {
    return (
      <Row key={item.propsKey} gutter={12}>
        <Col className="gutter-row" span={8}>
          <p>{item.label}</p>
        </Col>

        {item.type === 'text' &&
          (<>
            <Col className="gutter-row" span={2}>
              <p> : </p>
            </Col>
            <Col className="gutter-row" span={14}>
              <p style={{ 'overflowWrap': 'anywhere' }}>{item.value}</p>
            </Col></>)
        }

        {item.type === 'tags' &&
          (<>
            <Col className="gutter-row" span={2}>
              <p> : </p>
            </Col><br />
            <Col className="gutter-row" span={14}>
              {item.value.split(',').map((obj, i) => <Tag color={"#2e7cbd"} style={{ marginBottom: '10px' }} key={i}>{permissions_data[obj]}</Tag>)}
            </Col>
          </>)
        }
      </Row>
    );
  });

  return <div style={show}>{itemsList}</div>;
}
