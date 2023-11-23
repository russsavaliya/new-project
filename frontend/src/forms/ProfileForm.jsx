import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    Button,
    Input,
    message,
    Upload,
    Radio,
    Select,
} from "antd";

import Validator from "simple-react-validator";
import CommonInput, { useForceUpdate } from "@/components/CommonInput";
import { crud } from "@/redux/crud/actions";
import { useDispatch, useSelector } from "react-redux";
import { selectUpdatedItem } from "@/redux/crud/selectors";
import { PlusOutlined } from "@ant-design/icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import moment from "moment";
const Country = require("country-state-city").Country.getAllCountries();

// always define keys in initial state we can understand which key we are going to use
const initialValue = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    displayname: "",
    gender: "male",
    country: "",
    phone: "",
    bio: "",
    travel_points: '',
    activity_score: '',
    facebook_link: "",
    youtube_link: "",
    blog_link: "",
    instagram_link: "",
    interests: "",
};
export default function ProfileForm({ isUpdateForm = false, entity }) {
    const DISPATCH = useDispatch();
    const updateProfile = useSelector(selectUpdatedItem);
    const forceUpdate = useForceUpdate();
    const validator = useRef(new Validator({ autoForceUpdate: { forceUpdate } }));
    const [values, setValues] = useState(initialValue);
    const [media, setMedia] = useState({
        profilePicture: null,
        profileBanner: null,
    });
    const travelList = [
        "Beach",
        "Party",
        "Mountain",
        "Road Trip",
        "Hiking",
        "Paragliding",
        "Nature",
        "Tracking",
        "Safari",
        "Museum",
        "Camping",
        "Historical Places",
    ];
    useEffect(() => {
        if (updateProfile?.current && isUpdateForm) {
            setValues({
                ...updateProfile?.current,
                dob: moment(updateProfile?.current?.dob).format("YYYY-MM-DD"),
            });
        }
    }, [updateProfile]);

    function handleSuccess() {
        setValues(initialValue);
        setMedia({
            profilePicture: null,
            profileBanner: null,
        });
    }

    const onSubmit = () => {
        if (validator?.current?.allValid()) {
            let data = { ...values };
            if (updateProfile.current && isUpdateForm) {
                data.profile_picture_url = updateProfile.current.profile_picture_url;
                data.profile_banner_url = updateProfile.current.profile_banner_url;
            }
            const formData = new FormData();
            formData.append("postdata", JSON.stringify(data));
            if (media.profilePicture)
                formData.append("profilePicture", media.profilePicture);
            if (media.profileBanner)
                formData.append("profileBanner", media.profileBanner);

            const type = "multipart/form-data";
            if (updateProfile.current && isUpdateForm) {
                const id = updateProfile.current._id;
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
            });
        }
        return isJpgOrPng && isLt2M;
    }

    const handleFileUpload = (file, name) => {
        if (updateProfile.current && isUpdateForm) {
            if (name === "profilePicture")
                updateProfile.current.profile_picture_url = "";
            else updateProfile.current.profile_banner_url = "";
        }
        setMedia((media) => ({ ...media, [name]: file }));
    };

    useEffect(() => {
        let chars =
            "0123456789*abcdefghijklmnopqrstuvwxyz@#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let password = "";
        for (let i = 0; i <= 7; i++) {
            let randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber + 1);
        }
        setValues({ ...values, password });
    }, []);

    return (
        <>
            <CommonInput
                label="Email"
                required
                hasError={validator?.current?.message(
                    "email",
                    values?.email,
                    "required|email"
                )}
            >
                <Input
                    autoComplete={"off"}
                    value={values?.email}
                    name="email"
                    onChange={handleChange}
                />
            </CommonInput>
            {!isUpdateForm && (
                <CommonInput
                    label="Password"
                    required
                    hasError={validator?.current?.message(
                        "password",
                        values?.password,
                        "required"
                    )}
                >
                    <Input
                        autoComplete={"off"}
                        value={values?.password}
                        name="password"
                        onChange={handleChange}
                    />
                </CommonInput>
            )}
            <CommonInput
                hasError={validator?.current?.message(
                    "username",
                    values?.username,
                    "required|max:80"
                )}
                label="Username"
                required
            >
                <Input
                    autoComplete={"off"}
                    value={values?.username}
                    name="username"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "firstname",
                    values?.firstname,
                    "required|max:80"
                )}
                label="FirstName"
                required
            >
                <Input
                    autoComplete={"off"}
                    value={values?.firstname}
                    name="firstname"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "lastname",
                    values?.lastname,
                    "required|max:80"
                )}
                label="Lastname"
                required
            >
                <Input
                    autoComplete={"off"}
                    value={values?.lastname}
                    name="lastname"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Display Name",
                    values?.displayname,
                    "required|max:80"
                )}
                label="Display Name"
                required
            >
                <Input
                    autoComplete={"off"}
                    value={values?.displayname}
                    name="displayname"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Travel Points",
                    values?.travel_points,
                    "required"
                )}
                label="Travel Points"
                required
            >
                <Input
                    autoComplete={"off"}
                    type="number"
                    value={values?.travel_points}
                    name="travel_points"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Activity Score",
                    values?.activity_score,
                    "required"
                )}
                label="Activity Score"
                required
            >
                <Input
                    autoComplete={"off"}
                    type="number"
                    value={values?.activity_score}
                    name="activity_score"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Gender",
                    values?.gender,
                    "required"
                )}
                label="Gender"
                required
            >
                <Radio.Group
                    name="gender"
                    defaultValue="male"
                    value={values?.gender}
                    onChange={handleChange}
                >
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                </Radio.Group>
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Birth Date",
                    values?.dob,
                    "required"
                )}
                label="Birth Date"
                required
            >
                <Input
                    autoComplete={"off"}
                    type="date"
                    value={values?.dob}
                    name="dob"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Country",
                    values?.country,
                    "required"
                )}
                label="Country"
                required
            >
                <Select
                    autoComplete={"off"}
                    value={values?.country}
                    name="country"
                    showSearch
                    onChange={(value) =>
                        handleChange({ target: { name: "country", value } })
                    }
                    filterOption
                    optionFilterProp="value"
                >
                    {Country.map((country) => (
                        <Select.Option key={country.name} value={country.name}>
                            {country.name}
                        </Select.Option>
                    ))}
                </Select>
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "City",
                    values?.city,
                    "required|max:120"
                )}
                label="City"
                required
            >
                <Input
                    autoComplete={"off"}
                    value={values?.city}
                    name="city"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Mobile No.",
                    values?.phone,
                    "required"
                )}
                label="Mobile No."
                required
            >
                <PhoneInput
                    autoComplete={"off"}
                    country="in"
                    containerStyle={{ width: "100%" }}
                    inputProps={{
                        name: "phone",
                        style: {
                            width: "100%",
                        },
                    }}
                    prefix="+"
                    value={values?.phone}
                    name="phone"
                    copyNumbersOnly={false}
                    onChange={(value) =>
                        handleChange({ target: { name: "phone", value: `+${value}` } })
                    }
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Bio",
                    values?.bio,
                    "required|max:250|min:4"
                )}
                label="Bio"
                required
            >
                <Input.TextArea
                    autoComplete={"off"}
                    rows={3}
                    value={values?.bio}
                    name="bio"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Facebook Link",
                    values?.facebook_link,
                    "max:80"
                )}
                label="Facebook Link"
            >
                <Input
                    autoComplete={"off"}
                    value={values?.facebook_link}
                    name="facebook_link"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Youtube Link",
                    values?.youtube_link,
                    "max:80"
                )}
                label="Youtube Link"
            >
                <Input
                    autoComplete={"off"}
                    value={values?.youtube_link}
                    name="youtube_link"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Blog Link",
                    values?.blog_link,
                    "max:80"
                )}
                label="Blog Link"
            >
                <Input
                    autoComplete={"off"}
                    value={values?.blog_link}
                    name="blog_link"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Instagram Link",
                    values?.instagram_link,
                    "max:80"
                )}
                label="Instagram Link"
            >
                <Input
                    autoComplete={"off"}
                    value={values?.instagram_link}
                    name="instagram_link"
                    onChange={handleChange}
                />
            </CommonInput>
            <CommonInput
                hasError={validator?.current?.message(
                    "Travel Interests",
                    values?.interests,
                    "required"
                )}
                label="Travel Interests"
                required
            >
                <Select
                    autoComplete={"off"}
                    mode="multiple"
                    value={
                        values?.interests?.length > 0 ? values?.interests?.split(",") : []
                    }
                    name="interests"
                    showSearch
                    onChange={(value) => {
                        if (value.length <= 10)
                            handleChange({
                                target: { name: "interests", value: value.toString() },
                            });
                    }}
                    filterOption
                    optionFilterProp="value"
                >
                    {travelList.map((travel) => (
                        <Select.Option key={travel} value={travel}>
                            {travel}
                        </Select.Option>
                    ))}
                </Select>
            </CommonInput>

            <CommonInput
                label={"Profile Picture"}
                required
                hasError={validator?.current?.message(
                    "profile picture",
                    media.profilePicture || updateProfile?.current?.profile_picture_url,
                    "required"
                )}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {updateProfile?.current?.profile_picture_url && isUpdateForm && (
                        <Image
                            src={updateProfile?.current?.profile_picture_url}
                            width={110}
                        />
                    )}
                    <Upload
                        name="profilePicture"
                        listType="picture-card"
                        className="avatar-uploader"
                        beforeUpload={beforeUpload}
                        maxCount={1}
                        customRequest={({ onSuccess }) => onSuccess("ok")}
                        onChange={(data) =>
                            handleFileUpload(
                                data?.fileList[0]?.originFileObj || null,
                                "profilePicture"
                            )
                        }
                    >
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>
                </div>
            </CommonInput>
            <CommonInput label={"Profile Banner"}>
                {updateProfile?.current?.profile_banner_url && isUpdateForm && (
                    <Image src={updateProfile?.current?.profile_banner_url} width={110} />
                )}
                <Upload
                    name="profileBanner"
                    listType="picture-card"
                    className="avatar-uploader"
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    customRequest={({ onSuccess }) => onSuccess("ok")}
                    onChange={(data) =>
                        handleFileUpload(
                            data?.fileList[0]?.originFileObj || null,
                            "profileBanner"
                        )
                    }
                >
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                </Upload>
            </CommonInput>
            <Button type="primary" onClick={onSubmit}>
                Submit
            </Button>
        </>
    );
}
