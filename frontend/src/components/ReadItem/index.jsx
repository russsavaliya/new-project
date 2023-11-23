import React, { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Button,
  Image,
  Tag,
  Card,
  Typography,
  Avatar,
  Carousel,
} from "antd";
import { useSelector } from "react-redux";

import { useCrudContext } from "@/context/crud";
import { selectCurrentItem } from "@/redux/crud/selectors";
import { valueByString } from "@/utils/helpers";
import ReactPlayer from "react-player";
import "./ReadItem.css";
import moment from "moment";

export default function ReadItem({ config }) {
  let { readColumns, entity } = config;
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
    if (currentResult) {
      readColumns.map((props) => {
        const propsKey = props.dataIndex;
        const propsTitle = props.title;
        const propsType = props.type ? props.type : "text";
        const value = valueByString(currentResult, propsKey);
        list.push({
          propsKey,
          label: propsTitle,
          value: value,
          type: propsType,
          data: currentResult,
        });
      });
      setListState(list);
    }
  }, [currentResult]);

  useEffect(() => {
    let iframes = document.getElementsByTagName("iframe");
    if (iframes) {
      for (let i = 0; i < iframes.length; i++) {
        iframes[i].style.height = "360px";
        iframes[i].style.width = "100%";
      }
    }
  }, []);

  function displayArticle(data, key) {
    return (
      <Card key={key} style={{ width: "100%" }}>
        <div>
          <Typography.Text
            style={{ display: "flex", justifyContent: "center" }}
          >
            {data?.views} Views
          </Typography.Text>
        </div>
        <div style={{ display: "flex" }}>
          {data?.user_id && data?.user_id?.profile_picture_url ? (
            <Avatar
              alt={data?.user_id?.firstname?.toUpperCase()}
              src={data?.user_id?.profile_picture_url}
              size={"large"}
            />
          ) : (
            <Avatar
              alt={data?.user_id?.firstname?.toUpperCase()}
              size={"large"}
            />
          )}
          <div>
            <Typography.Title level={3}>
              {data?.user_id?.firstname + " " + data?.user_id?.lastname}
            </Typography.Title>
            <Typography.Text>
              {moment(data?.createdAt).format("YYYY-MM-DD HH:mm")}
            </Typography.Text>
          </div>
        </div>
        <div>
          {data.article.map((article, i) => (
            <div
              style={{ marginTop: "2%", marginBottom: "2%" }}
              key={i + data.user_id}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {article.title && (
                  <Typography.Title level={3}>{article.title}</Typography.Title>
                )}
              </div>
              {article.paragraph && (
                <div style={{ margin: "5px" }}>
                  {/* <Typography.Text> */}
                  <div
                    className="pRoot"
                    dangerouslySetInnerHTML={{
                      __html: article.paragraph || "",
                    }}
                  />
                  {/* </Typography.Text> */}
                </div>
              )}
              {article?.media_type?.length > 0 && (
                <div>
                  {article?.media_type === "image" && (
                    <Image alt="" src={article?.media_url} />
                  )}
                  {article.media_type === "video" && (
                    <ReactPlayer
                      controls={true}
                      url={article.media_url}
                      width={"100%"}
                      height={"100%"}
                    />
                  )}
                  {article.media_type === "embed_code" && (
                    <div
                      className="iframe"
                      dangerouslySetInnerHTML={{
                        __html: article.embed_code ? article.embed_code : "",
                      }}
                      style={{ width: "100%" }}
                    />
                  )}
                  {article.media_type === "video_url" && (
                    <ReactPlayer
                      controls={true}
                      url={article.video_url}
                      width={"100%"}
                      height={"100%"}
                    />
                  )}
                </div>
              )}

              {article.media_credit && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Typography.Text>
                      {article.media_credit || ""}
                    </Typography.Text>
                  </div>
                  <hr style={{ margin: "15px 0px" }} />
                </div>
              )}
              {article.tags && article.tags.split(",").length > 0 && (
                <div>
                  {article.tags.split(",").map((tag) => (
                    <React.Fragment key={tag}>
                      <Tag color={"blue"}>{tag}</Tag>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const show = isReadBoxOpen
    ? { display: "block", opacity: 1 }
    : { display: "none", opacity: 0 };

  const itemsList = listState.map((item) => {
    if (item.label === "Article") {
      return (
        <Row key={item.propsKey} gutter={12}>
          {displayArticle(item?.data, item.propsKey)}
        </Row>
      );
    } else {
      return (
        <Row key={item.propsKey} gutter={12}>
          <Col className="gutter-row" span={8}>
            <p>{item.label}</p>
          </Col>

          {item.type === "text" && (
            <>
              <Col className="gutter-row" span={2}>
                <p> : </p>
              </Col>
              <Col className="gutter-row" span={14}>
                <p style={{ overflowWrap: "anywhere" }}>{item.value}</p>
              </Col>
            </>
          )}

          {item.type === "front-link" && (
            <>
              <Col className="gutter-row" span={2}>
                <p> : </p>
              </Col>
              <Col className="gutter-row" span={14}>
                <a
                  href={`${process.env.REACT_APP_FRONTEND_URL}/${entity === "articles"
                    ? "article"
                    : entity === "post"
                      ? "post"
                      : ""
                    }/${item.value}`}
                  style={{ overflowWrap: "anywhere" }}
                  target="_blank"
                >
                  Click to go to frontend
                </a>
              </Col>
            </>
          )}

          {item.type === "user" && (
            <>
              <Col className="gutter-row" span={2}>
                <p> : </p>
              </Col>
              <Col className="gutter-row" span={14}>
                <p style={{ overflowWrap: "anywhere" }}>
                  {typeof item.data[item.propsKey] === "object"
                    ? item.data[item.propsKey]?.firstname +
                    " " +
                    item.data[item.propsKey]?.lastname
                    : item.data[item.propsKey]}
                </p>
              </Col>
            </>
          )}

          {item.type === "date" && (
            <>
              <Col className="gutter-row" span={2}>
                <p> : </p>
              </Col>
              <Col className="gutter-row" span={14}>
                <p style={{ overflowWrap: "anywhere" }}>
                  {moment(item.value).format("YYYY-MM-DD HH:mm")}
                </p>
              </Col>
            </>
          )}

          {item.type === "image" && (
            <>
              <Col className="gutter-row" span={2}>
                <p> : </p>
              </Col>
              <br />
              <Col className="gutter-row" span={14}>
                {item.value !== "" && (
                  <Image width={200} height={200} src={item.value} />
                )}
              </Col>
            </>
          )}

          {item.type === "media" && (
            <>
              <Col className="gutter-row" span={2}>
                <p> : </p>
              </Col>
              <br />
              <Col className="gutter-row" span={14}>
                {item.data.media_type === "image" && (
                  <Carousel swipeToSlide draggable dotPosition="top">
                    {item.data.media_url.map((url) => (
                      <Image
                        key={url}
                        width={"100%"}
                        className="single-image"
                        // height={"auto"}
                        // style={{ maxHeight: "500px", objectFit: "contain" }}
                        src={url}
                        preview={false}
                      />
                    ))}
                  </Carousel>
                )}

                {item.data.media_type === "video" && (
                  <ReactPlayer
                    controls={true}
                    url={item.data.media_url}
                    width={"100%"}
                    height={"100%"}
                  />
                )}
                {item.data.media_type === "embed_code" && (
                  <div
                    className="iframe"
                    dangerouslySetInnerHTML={{
                      __html: item.data.embed_code ? item.data.embed_code : "",
                    }}
                    style={{ width: "100%" }}
                  />
                )}
                {item.data.media_type === "video_url" && (
                  <ReactPlayer
                    controls={true}
                    url={item.data.video_url}
                    width={"100%"}
                    height={"100%"}
                  />
                )}
              </Col>
            </>
          )}
          {item.type == "content" && (
            <>
              <Col className="gutter-row" span={2}>
                <p> : </p>
              </Col>
              <br />
              <Col className="gutter-row" span={14}>
                <div style={{ margin: "5px" }}>
                  {/* <Typography.Text> */}
                  <div
                    className="pRoot"
                    dangerouslySetInnerHTML={{
                      __html: item.value || "",
                    }}
                  />
                  {/* </Typography.Text> */}
                </div>
              </Col>
            </>
          )}
          {item.type === "imagelist" && (
            <>
              <Col className="gutter-row" span={2}>
                <p> : </p>
              </Col>
              <br />
              <Col className="gutter-row" span={14}>
                {item.value.map((object, i) => (
                  <Image width={200} height={200} src={object} key={object} />
                ))}
              </Col>
            </>
          )}

          {item.type === "tags" && (
            <>
              <Col className="gutter-row" span={2}>
                <p> : </p>
              </Col>
              <br />
              <Col className="gutter-row" span={14}>
                {item.value.split(",").map((obj, i) => (
                  <Tag color={"#2e7cbd"} key={obj}>
                    {obj.toUpperCase()}
                  </Tag>
                ))}
              </Col>
            </>
          )}
          {item.type === "role" && (
            <>
              <Col className="gutter-row" span={2}>
                <p> : </p>
              </Col>
              <br />
              <Col className="gutter-row" span={14}>
                <p style={{ overflowWrap: "anywhere" }}>
                  {item?.data?.role?.name || ""}
                </p>
              </Col>
            </>
          )}
        </Row>
      );
    }
  });

  return <div style={show}>{itemsList}</div>;
}
