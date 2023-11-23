import React from "react";
import {
    Button,
    Carousel,
    Input,
    Select,
    Tooltip,
    Typography,
} from "antd";
import { useState } from "react";
import "./Article/Article.css";
import { DeleteOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";
import TagSelector from "@/components/TagSelector";
import { crud } from "@/redux/crud/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectUpdatedItem } from "@/redux/crud/selectors";
import { useEffect } from "react";
import SelectUser from "@/components/UserSelect";

export default function PostForm({ entity, isUpdateForm = false }) {
    const [users, setUsers] = useState([]);
    const [toggle, setToggle] = useState({ embed_code: false, video_url: false });
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const DISPATCH = useDispatch();
    const updatePost = useSelector(selectUpdatedItem);
    const [values, setValues] = useState({
        title: "",
        user_id: "",
        embed_code: "",
        video_url: "",
        desc: "",
        media_url: [],
        isDeleted: false,
        tags: "",
        media_type: "",
    });
    const [errors, setErrors] = useState({
        title: "",
        user_id: "",
        embed_code: "",
        video_url: "",
        desc: "",
        isDeleted: false,
        tags: "",
        media_type: "",
    });
    const [hasFormError, setHasFormError] = useState(false);

    useEffect(() => {
        if (updatePost && isUpdateForm) {
            setValues({
                title: updatePost.current?.title,
                user_id: updatePost.current?.user_id,
                embed_code: updatePost.current?.embed_code,
                video_url: updatePost.current?.video_url,
                desc: updatePost.current?.desc,
                media_url: updatePost.current?.media_url,
                media_type: updatePost.current?.media_type,
                isDeleted: updatePost.current?.isDeleted,
                tags: updatePost.current?.tags,
            });
        }
    }, [updatePost]);

    function handleRemoveOriginal() {
        setFiles([]);
        setValues({
            ...values,
            media_type: "",
            media_url: [],
            embed_code: "",
            video_url: "",
        });
    }

    function handleFiles(event) {
        let hasError = false;
        if (event.target.name === "image") {
            if (event.target.files.length > 5) {
                setErrors({
                    ...errors,
                    media_type: "You can not select more than 5 files.",
                });
                hasError = true;
            } else if (event.target.files.length > 0) {
                if (
                    !event.target.files[0].name.match(/\.(jpg|jpeg|png|gif)$/) &&
                    !event.target.files[0].name.match(/\.(JPG|JPEG|PNG|GIF)$/)
                ) {
                    setErrors({
                        ...errors,
                        media_type: "Image extensions allowed are JPG, JPEG, PNG, GIF",
                    });
                    hasError = true;
                } else if (event.target.files[0].size > 20971520) {
                    setErrors({
                        ...errors,
                        media_type: "Please select an Image no bigger than 20 MB",
                    });
                    hasError = true;
                } else {
                    setValues({
                        ...values,
                        embed_code: "",
                        video_url: "",
                        media_type: "image",
                    });
                    setErrors({ ...errors, media_type: "" });
                    hasError = false;
                }
            }
            let files = event.target.files;
            let newfiles = [];
            for (let i = 0; i < files.length; i++) {
                newfiles.push(files[i]);
            }
            setFiles(newfiles);
        } else {
            if (event.target.files.length > 0) {
                if (
                    !event.target.files[0].name.match(/\.(mp4|avi|m4v|qt|m1v)$/) &&
                    !event.target.files[0].name.match(/\.(MP4|AVI|M4V|QT|M1V)$/)
                ) {
                    setErrors({
                        ...errors,
                        media_type: "Video extensions allowed are MP4, AVI, M4V, QT, M1V",
                    });
                    hasError = true;
                } else if (event.target.files[0].size > 41943040) {
                    setErrors({
                        ...errors,
                        media_type: "Please select video no bigger than 40 MB",
                    });
                    hasError = true;
                } else {
                    setValues({
                        ...values,
                        embed_code: "",
                        video_url: "",
                        media_type: "video",
                    });
                    setErrors({ ...errors, media_type: "" });
                    hasError = false;
                }
            }
            setFiles([event.target.files[0]]);
        }
        setHasFormError(hasError);
    }


    function handleChange(e) {
        let media_type = values.media_type;
        const { name, value } = e.target;
        if (name === "embed_code" || name === "video_url") {
            media_type = name;
        }
        setValues({
            ...values,
            [name]: value,
            media_type: media_type,
        });
        setErrors({ ...errors, [name]: "" });
        setHasFormError(false);
    }

    function handleSelect(value, name) {
        setValues({ ...values, [name]: value });
        setErrors({ ...errors, [name]: "" });
        setHasFormError(false);
    }

    function handleSuccess() {
        setValues({
            title: "",
            user_id: "",
            embed_code: "",
            video_url: "",
            desc: "",
            media_url: [],
            media_type: "",
            tags: "",
            isDeleted: false,
        });
        setErrors({
            title: "",
            user_id: "",
            embed_code: "",
            video_url: "",
            desc: "",
            media_type: "",
            tags: "",
            isDeleted: "",
        });
    }

    function handleSubmit() {
        let formError = { ...errors };
        let formValue = { ...values };
        let hasError = hasFormError;
        if (formValue.title) {
            formError.title = "";
            if (formValue.title.length >= 2 && formValue.title.length <= 80) {
                formError.title = "";
            } else {
                formError.title = "Title length should be more than 2 and less than 80";
                hasError = true;
            }
        } else {
            formError.title = "Title is required";
            hasError = true;
        }
        if (formValue.user_id !== "") {
            formError.user_id = "";
        } else {
            formError.user_id = "Please select the user of the post";
        }
        if (formValue.isDeleted !== "") {
            formError.isDeleted = "";
        } else {
            formError.isDeleted = "Please select post's deleted status";
            hasError = true;
        }
        if (formValue.tags !== "") {
            formError.tags = "";
        } else {
            formError.tags = "Please select some tags";
            hasError = true;
        }
        if (formValue.desc) {
            if (formValue.desc.length >= 4 && formValue.desc.length <= 250) {
                formError.desc = "";
            } else {
                formError.desc =
                    "Description length should be more than 4 and less than 250";
                hasError = true;
            }
        } else {
            formError.desc = "Description is required";
            hasError = true;
        }
        if (formValue.media_type) {
            formError.media_type = "";
            if (formValue.media_url) {
                if (
                    formValue.media_type === "embed_code" ||
                    formValue.media_type === "video_url"
                ) {
                    delete formValue.media_url;
                    setFiles([]);
                } else {
                    formValue.embed_code = "";
                    formValue.video_url = "";
                }
            }
            if (files.length > 0) {
                delete formValue.media_url;
            }
            if (formValue.media_type === "embed_code") {
                formValue.video_url = "";
            } else if (formValue.media_type === "video_url") {
                formValue.embed_code = "";
            }
        } else {
            if (files?.length < 1) {
                hasError = true;
                formError.media_type =
                    "Please upload photo, video or attach embed code or video url";
            } else {
                delete formValue.media_url;
            }
        }
        setErrors({ ...formError });
        setHasFormError(hasError);
        if (!hasError) {
            const formData = new FormData();
            formData.append("postdata", JSON.stringify(formValue));
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    formData.append("media", files[i]);
                }
            }
            const type = "multipart/form-data";
            if (updatePost && isUpdateForm) {
                const id = updatePost.current._id;
                const res = DISPATCH(crud.update(entity, id, formData, type));
                res.then(handleSuccess);
            } else {
                const res = DISPATCH(crud.create(entity, formData, type));
                res.then(handleSuccess);
            }
        }
    }

    const handleTagChange = (tags = "") => {
        setValues({ ...values, tags });
        setErrors({ ...errors, tags: tags ? "" : "Tag is required" });
    };

    return (
        <>
            <Typography.Text>Select User</Typography.Text>
            <SelectUser value={values.user_id} onChange={handleSelect} />
            {errors.user_id && <p className="media-error">{errors.user_id}</p>}

            <Typography.Text>Select Deleted Status</Typography.Text>
            <Select
                name="isDeleted"
                placeholder="Select Deleted Status"
                onChange={(value) => handleSelect(value, "isDeleted")}
                style={{ width: "100%", marginBottom: "15px" }}
                value={values.isDeleted || false}
            >
                <Select.Option value={false}>Not Deleted</Select.Option>
                <Select.Option value={true}>Deleted</Select.Option>
            </Select>
            {errors.isDeleted && <p className="media-error">{errors.isDeleted}</p>}
            <Typography.Text>Select Title</Typography.Text>
            <Input
                name="title"
                value={values.title || ""}
                placeholder="Enter Title"
                onChange={handleChange}
            />
            {errors.title && <p className="media-error">{errors.title}</p>}
            <div className="edit-article-file" style={{ margin: "15px 0" }}>
                {values.media_type === "" ||
                    values.media_type === "embed_code" ||
                    values.media_type === "video_url" ? (
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
                                onChange={handleFiles}
                                accept="image/*"
                                className="t_cp"
                                multiple
                                name="image"
                                id="image-file"
                                type="file"
                                style={{ display: "none" }}
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
                                onChange={handleFiles}
                                accept="video/*"
                                className="video t_cp"
                                name="video"
                                id="video-file"
                                type="file"
                                style={{ display: "none" }}
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
                                onClick={() =>
                                    setToggle({ video_url: false, embed_code: !toggle.embed_code })
                                }
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
                                onClick={() =>
                                    setToggle({ embed_code: false, video_url: !toggle.video_url })
                                }
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
                                    value={values?.embed_code || ""}
                                    onChange={handleChange}
                                />
                            )}
                            {toggle.video_url && (
                                <Input
                                    name="video_url"
                                    placeholder="Paste Video Url..."
                                    value={values?.video_url || ""}
                                    onChange={handleChange}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <div className="media-display">
                        {values.media_type === "image" && (
                            <div style={{ width: "100%" }}>
                                {files.length > 0 ? (
                                    <Carousel swipeToSlide draggable dotPosition="top">
                                        {files.map((file, i) => (
                                            <img
                                                key={i}
                                                className="single-image"
                                                src={URL.createObjectURL(file)}
                                            />
                                        ))}
                                    </Carousel>
                                ) : (
                                    <Carousel dotPosition="top">
                                        {values.media_url.map((url) => (
                                            <img key={url} className="single-image" src={url} />
                                        ))}
                                    </Carousel>
                                )}
                            </div>
                        )}
                        {values.media_type === "video" && (
                            <>
                                {files.length > 0 ? (
                                    <ReactPlayer
                                        controls={true}
                                        url={URL.createObjectURL(files[0])}
                                        width={"100%"}
                                        // height={"100%"}
                                        style={{ maxHeight: "265px", paddingBottom: "5px" }}
                                    />
                                ) : (
                                    <ReactPlayer
                                        controls={true}
                                        url={values.media_url[0]}
                                        width={"100%"}
                                        // height={"100%"}
                                        style={{ maxHeight: "265px", paddingBottom: "5px" }}
                                    />
                                )}
                            </>
                        )}
                        {values.media_type && (
                            <div className="delete-original-icon">
                                <Tooltip title="Delete Media">
                                    <Button danger onClick={handleRemoveOriginal}>
                                        <DeleteOutlined />
                                    </Button>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                )}
                {errors.media_type && (
                    <p className="media-error">{errors.media_type}</p>
                )}
            </div>
            <div className="mb-15">
                <Typography.Text>
                    Add Description{" "}
                    <Typography.Text type="secondary">
                        (Maximum 250 characters)
                    </Typography.Text>
                </Typography.Text>
                <Input.TextArea
                    placeholder={"Write description of post"}
                    rows={4}
                    name="desc"
                    value={values.desc || ""}
                    style={{ width: "100%" }}
                    onChange={handleChange}
                />
                {errors.desc && <p className="media-error">{errors.desc}</p>}
            </div>
            <div className="mb-15">
                <Typography.Text>
                    Add Tags{" "}
                    <Typography.Text type="secondary">
                        (Maximum 5 tags allowed)
                    </Typography.Text>
                </Typography.Text>
                <TagSelector value={values.tags} onChange={handleTagChange} />
            </div>
            <div>
                <Button type="primary" onClick={handleSubmit}>Submit</Button>
            </div>
        </>
    );
}
