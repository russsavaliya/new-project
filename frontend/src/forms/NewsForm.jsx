import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    Button,
    Input,
    message,
    Upload,
    Select
} from "antd";

import Validator from "simple-react-validator";
import CommonInput, { useForceUpdate } from "@/components/CommonInput";
import { crud } from "@/redux/crud/actions";
import { useDispatch, useSelector } from "react-redux";
import { selectUpdatedItem } from "@/redux/crud/selectors";
import { PlusOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import TagSelector from "@/components/TagSelector";
import { Editor } from "@tinymce/tinymce-react";
import { request } from "@/request";
import "./News/News.css";
import axios from "axios";
import { token as tokenCookies } from "@/auth";


const initialValue = {
    title: "",
    author: "",
    content: "",
    tags: "",
    meta_description: "",
    category_id: ""
};


export default function NewsForm({ isUpdateForm = false, entity }) {
    const DISPATCH = useDispatch();
    let source = request.source();
    const updateNews = useSelector(selectUpdatedItem);
    const forceUpdate = useForceUpdate();
    const validator = useRef(new Validator({ autoForceUpdate: { forceUpdate } }));
    const [values, setValues] = useState(initialValue);
    const [categoryOption, setcategoryOption] = useState([]);
    const [loading, setLoading] = useState(false);

    const [media, setMedia] = useState({
        news_picture_url: null,
    });
    const [errors, setErrors] = useState({
        tags: ""
    });

    useEffect(() => {
        setLoading(false);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}newscategory/list`, { headers: { [process.env.REACT_APP_ACCESS_TOKEN_NAME]: tokenCookies.get() } }).then((response) => {
            setcategoryOption(response.data.result);
        }).catch((error) => {
            setLoading(false)
        });
    }, [])


    useEffect(() => {
        if (updateNews?.current && isUpdateForm) {
            setValues({
                ...updateNews?.current,
                category_id: updateNews?.current?.category_id?._id,
                tags: updateNews?.current?.tags
            });
        }
    }, [updateNews.current]);


    function handleSuccess() {
        setValues(initialValue);
        setMedia({
            news_picture_url: null,
        });
    }

    const onSubmit = () => {
        if (validator?.current?.allValid()) {
            let data = { ...values };
            if (updateNews.current && isUpdateForm) {
                data.news_picture_url = updateNews.current.news_picture_url;
            }
            const formData = new FormData();
            formData.append("postdata", JSON.stringify(data));

            if (media.news_picture_url)
                formData.append("news_picture_url", media.news_picture_url);

            const type = "multipart/form-data";
            if (updateNews.current && isUpdateForm) {

                const id = updateNews.current._id;
                const res = DISPATCH(crud.update(entity, id, formData, type));
                res.then(handleSuccess);
            } else {
                const res = DISPATCH(crud.create(entity, formData, type));
                res.then(handleSuccess);
            }
        } else {
            validator?.current?.showMessages();
        }
    };

    const handleTagChange = (tags = "") => {
        setValues({ ...values, tags });
        setErrors({ ...errors, tags: tags ? "" : "Tag is required" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    function beforeUpload(file) {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!").then((r) => {
            });
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!").then((r) => {
                p
            });
        }
        return isJpgOrPng && isLt2M;
    }

    const handleEditorChange = (value, editor) => {
        setValues({ ...values, content: value })
    };

    const handleselect = (value, name) => {
        setValues({ ...values, [name]: value })
    }

    const handleFileUpload = (file, name) => {
        setMedia((media) => ({ ...media, [name]: file }));
    };

    const example_image_upload_handler = async (blobInfo, progress) => {
        await axios.post("http://localhost:5001/api/news/image")
            .then((response) => {
                const data = new FormData()
                data.append("image", file)
                console.log(data, "data")
            })
            .catch((err) => {
                console.log(response);
            })
    }

    return (
        <>
            <CommonInput
                label="Category"
                required
                hasError={validator?.current?.message("category", values?.category_id, "required")}
            >
                <Select
                    name="category_id"
                    placeholder="Select a Category"
                    showSearch
                    onChange={(value) => handleselect(value, "category_id")}
                    value={values?.category_id}
                    optionFilterProp="label"
                    filterOption
                    //onSearch={onSearch}
                    loading={loading}
                >
                    {categoryOption.map((value) => {
                        return (
                            <Select.Option
                                key={value._id}
                                value={value._id}>
                                {value.name}</Select.Option>
                        )
                    })
                    }
                </Select>
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "title",
                    values?.title,
                    "required|max:80"
                )}
                label="Title"
                required
            >
                <Input
                    autoComplete={"off"}
                    value={values?.title}
                    name="title"
                    onChange={handleChange}
                />
            </CommonInput>
            <h3>content</h3>
            <Editor
                apiKey={'558g6bb9fhfu000ouk6syny4b8yn6xb8awmsbj1ntp8edcmb'}
                value={values?.content}
                name="content"
                init={{
                    file_picker_types: 'file image media',
                    plugins: "link anchor, wordcount image paste image code autolink",
                    nonbreaking_force_tab: true,
                    branding: false,
                    menubar: false,
                    toolbar: "undo redo | image  link |bold italic underline strikethrough | alignleft aligncenter alignright alignjustify" +
                        "| forecolor backcolor | bullist numlist",
                    elementpath: false,
                    images_upload_url: 'postAcceptor.php',
                    automatic_uploads: false,
                    block_unsupported_drop: false,
                    file_picker_types: 'file image media',
                    images_file_types: 'jpg,svg,webp',
                    images_reuse_filename: true,
                    images_upload_base_path: '/some/basepath',
                    location: '/uploaded/image/path/image.png',
                    content_style: 'body { font-family:Arial,sans-serif; font-size:18px; }',
                    images_upload_handler: example_image_upload_handler
                }}
                onEditorChange={handleEditorChange}
            ></Editor>
            <CommonInput
                style={{ marginTop: 20 }}
                hasError={validator?.current?.message(
                    "author",
                    values?.author,
                    "required|max:80"
                )}
                label="Author"
                required
            >
                <Input
                    autoComplete={"off"}
                    value={values?.author}
                    name="author"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                label={"News picture"}
                required
                hasError={validator?.current?.message(
                    "News picture",
                    media.news_picture_url || updateNews?.current?.news_picture_url,
                    "required"
                )}
            >
                {updateNews?.current?.news_picture_url && isUpdateForm && (
                    <Image src={updateNews?.current?.news_picture_url} width={110} />
                )}
                <Upload
                    name="news_picture_url"
                    listType="picture-card"
                    className="avatar-uploader"
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    customRequest={({ onSuccess }) => onSuccess("ok")}
                    onChange={(data) =>
                        handleFileUpload(
                            data?.fileList[0]?.originFileObj || null,
                            "news_picture_url"
                        )
                    }
                >
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                </Upload>
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "meta_description",
                    values?.meta_description,
                    "required|max:250|min:4"
                )}
                label="Meta description"
                required
            >
                <Input.TextArea
                    autoComplete={"off"}
                    rows={3}
                    value={values?.meta_description}
                    name="meta_description"
                    onChange={handleChange}
                />
            </CommonInput>
            <div className="mb-15">
                <Typography.Text>
                    Add Tags{" "}
                    <Typography.Text type="secondary">
                        (Maximum 5 tags allowed)
                    </Typography.Text>
                </Typography.Text>
                <TagSelector value={values.tags} onChange={handleTagChange} />
            </div>

            <Button type="primary" onClick={onSubmit}>
                Submit
            </Button>
        </>
    );
}
