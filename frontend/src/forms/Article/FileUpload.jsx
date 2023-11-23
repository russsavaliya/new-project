import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import {useDispatchArticle, useArticle} from "./ArticleContext";
import {Input, Typography, Tooltip, Button} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

const initialState = {
    toggle: {
        embed_code: false,
        video_url: false,
    },
    file: {
        image: null,
        video: null,
        embed_code: "",
        video_url: "",
        media_credit: "",
    },
};
const FileUpload = () => {
    const dispatch = useDispatchArticle();
    const _stepCount = useArticle((e) => e.stepCount);
    const _article = useArticle((e) => e.article);
    const _error = useArticle((e) => e.error);
    const [toggle, setToggle] = useState(initialState.toggle);
    const [media_type, setMedia_type] = useState("");
    const [file, setFile] = useState(initialState.file);
    const handle = {
        toggle: (e) => {
            setToggle({...initialState.toggle, [e]: !toggle[e]});
        },
        deleteOriginal: () => {
            if (
                _article[_stepCount]?.media_type === "image" ||
                _article[_stepCount]?.media_type === "video"
            ) {
                dispatch({
                    type: "UPDATE_ARTICLE",
                    payload: [
                        {name: "media_type", value: ""},
                        {name: "media", value: null},
                    ],
                });
                setFile({...file, [media_type]: null});
                setMedia_type("");
            }
        },
        change: (e) => {
            let {name} = e.target;
            if (name === "embed_code" || name === "video_url") {
                let {value} = e.target;
                setFile({...initialState.file, [name]: value});
                dispatch({
                    type: "UPDATE_ARTICLE",
                    payload: [
                        {name: "media_type", value: value.length ? name : ""},
                        {name: name, value: e.target.value},
                    ],
                });
                setMedia_type(name);
                if (e.target.value) {
                    dispatch({
                        type: "SET_ERROR_MESSAGE",
                        payload: {name: "media_type", value: ""},
                    });
                }
            } else if (name === "media_credit") {
                let {value} = e.target;
                if (value.length <= 30) {
                    setFile({...file, [name]: value});
                    dispatch({
                        type: "UPDATE_ARTICLE",
                        payload: {name: name, value: e.target.value},
                    });
                }
            } else {
                if (e.target.files.length !== 0) {
                    if (name === "image") {
                        if (/\.(gif|jpe?g|png)$/i.test(e.target.files[0]?.name)) {
                            if (e.target.files[0]?.size > 20971520) {
                                dispatch({
                                    type: "SET_ERROR_MESSAGE",
                                    payload: {
                                        name: "media_type",
                                        value: "Please upload file less than 20 mb.",
                                    },
                                });
                            } else {
                                dispatch({
                                    type: "SET_ERROR_MESSAGE",
                                    payload: {name: "media_type", value: ""},
                                });
                                dispatch({
                                    type: "UPDATE_ARTICLE",
                                    payload: [
                                        {name: "media", value: e.target.files[0]},
                                        {name: "media_type", value: name},
                                    ],
                                });
                                setFile({
                                    ...initialState.file,
                                    video: '',
                                    [name]: URL.createObjectURL(e.target.files[0]),
                                });
                                setMedia_type(name);
                            }
                        } else {
                            dispatch({
                                type: "SET_ERROR_MESSAGE",
                                payload: {
                                    name: "media_type",
                                    value:
                                        "Photo only allows file types of GIF, PNG, JPG and JPEG",
                                },
                            });
                        }
                    } else if (name === "video") {
                        if (/\.(mp4|avi|m4v|qt|m1v)$/i.test(e.target.files[0]?.name)) {
                            if (e.target.files[0]?.size > 41943040) {
                                dispatch({
                                    type: "SET_ERROR_MESSAGE",
                                    payload: {
                                        name: "media_type",
                                        value: "Please upload file less than 40 mb.",
                                    },
                                });
                            } else {
                                dispatch({type: "SET_ERROR_MESSAGE", payload: {name: "media_type", value: ""}});
                                dispatch({
                                    type: "UPDATE_ARTICLE",
                                    payload: [
                                        {name: "media", value: e.target.files[0]},
                                        {name: "media_type", value: name},
                                    ],
                                });
                                setFile({
                                    ...initialState.file,
                                    image: '',
                                    [name]: URL.createObjectURL(e.target.files[0]),
                                });
                                setMedia_type(name);
                            }
                        } else {
                            dispatch({
                                type: "SET_ERROR_MESSAGE",
                                payload: {
                                    name: "media_type",
                                    value:
                                        "Video only allows file types of mp4, m4v, qt, avi and m1v",
                                },
                            });
                        }
                    }
                }
            }
        },
    };
    useEffect(() => {
        const files = {...initialState.file};
        let mediaType = _article[_stepCount]?.media_type;
        if (mediaType) {
            if (mediaType === "image" || mediaType === "video")
                files[mediaType] = _article[_stepCount]?.media
                    ? URL.createObjectURL(_article[_stepCount]?.media)
                    : _article[_stepCount]?.media_url;
            else if (mediaType === "embed_code" || mediaType === "video_url") {
                files[mediaType] = _article[_stepCount][mediaType];
                setToggle({...initialState.toggle, [mediaType]: true});
            }
        }
        files.media_credit = _article[_stepCount]?.media_credit || "";
        setFile({...files});
        setMedia_type(mediaType);
        // eslint-disable-next-line
    }, [_stepCount]);
    return (
        <div className="edit-article-file">
            {_article[_stepCount]?.media_type === '' ||
            _article[_stepCount]?.media_type === "embed_code" ||
            _article[_stepCount]?.media_type === "video_url" ?
                <>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            marginTop: "15px",
                        }}
                    >
                        <input
                            onChange={handle.change}
                            accept="image/*"
                            className="t_cp"
                            name="image"
                            id="image-file"
                            type="file"
                            style={{display: "none"}}
                        />
                        <div className="upload-icon">
                            <div>
                                <label htmlFor="image-file" className="t_cp">
                                    <img
                                        alt="image_icon"
                                        src="/images/upload-image-icon.webp"
                                        draggable={false}
                                        className="icon-image"
                                    />
                                    Upload Image
                                </label>
                            </div>
                            <Typography.Text type="secondary">
                                Maximum image size 5 MB
                            </Typography.Text>
                        </div>
                        OR
                        <input
                            onChange={handle.change}
                            accept="video/*"
                            className="video t_cp"
                            name="video"
                            id="video-file"
                            type="file"
                            style={{display: "none"}}
                        />
                        <div className="upload-icon">
                            <div>
                                <label htmlFor="video-file" className="t_cp">
                                    <img
                                        alt="video_icon"
                                        src="/images/upload-video-icon.webp"
                                        draggable={false}
                                        className="icon-image"
                                    />
                                    Upload Video
                                </label>
                            </div>
                            <Typography.Text type="secondary">
                                Maximum video size 10 MB
                            </Typography.Text>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "5px",
                            marginBottom: "15px",
                            gap: "10px",
                            paddingRight: "30px",
                        }}
                    >
                        <Button
                            size="small"
                            sx={{
                                textTransform: "none",
                                color: "black",
                                boxShadow:
                                    "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
                            }}
                            onClick={() => handle.toggle("embed_code")}
                        >
                            Embed Video
                        </Button>
                        <Button
                            size="small"
                            sx={{
                                textTransform: "none",
                                color: "black",
                                boxShadow:
                                    "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
                            }}
                            onClick={() => handle.toggle("video_url")}
                        >
                            Add Video URL
                        </Button>
                    </div>

                    <div>
                        {toggle.embed_code && (
                            <Input.TextArea
                                name="embed_code"
                                placeholder="Paste Video Embed Code...."
                                rows={3}
                                value={file?.embed_code || ""}
                                onChange={handle.change}
                            />
                        )}
                        {toggle.video_url && (
                            <Input
                                name="video_url"
                                placeholder="Paste Video Url..."
                                value={file?.video_url || ""}
                                onChange={handle.change}
                            />
                        )}
                    </div>
                </>
                :
                <div className="media-display">
                    {_article[_stepCount]?.media_type === "image" && <img src={file.image} style={{maxHeight: "265px"}} alt={''}/>}
                    {_article[_stepCount]?.media_type === "video" && (
                        <ReactPlayer
                            controls={true}
                            url={file.video}
                            width={"100%"}
                            // height={"100%"}
                            style={{maxHeight: "265px", paddingBottom: "5px"}}
                        />
                    )}
                    {_article[_stepCount]?.media_type && (
                        <div className="delete-original-icon">
                            <Tooltip title="Delete Media">
                                <Button danger onClick={handle.deleteOriginal}>
                                    <DeleteOutlined/>
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                </div>}
            {_article[_stepCount]?.media_type && (
                <div className="media-credit">
                    <Typography.Text>Add Media Credit:</Typography.Text>
                    <Input
                        name="media_credit"
                        placeholder="Add Media Credit"
                        value={file?.media_credit || ""}
                        onChange={handle.change}
                    />
                </div>
            )}
            {_error?.[_stepCount].media_type && (
                <p className="media-error">
                    {_error?.[_stepCount].media_type}
                </p>
            )}
        </div>
    );
};

export default FileUpload;
