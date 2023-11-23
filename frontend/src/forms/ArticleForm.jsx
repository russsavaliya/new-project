import React, { useRef, useState } from "react";
import { Button, Select, Typography } from "antd";
import StepsOfArticle from "./Article/StepsOfArticle";
import { ArticleProvider } from "./Article/ArticleContext";
import { useDispatchArticle } from "./Article/ArticleContext";
import { useArticle } from "./Article/ArticleContext";
import { useEffect } from "react";
import "./Article/Article.css";
import { articleConfiguration } from "./Article/ArticleContext";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { selectUpdatedItem } from "@/redux/crud/selectors";
import CommonInput, { useForceUpdate } from "@/components/CommonInput";
import Validator from "simple-react-validator";
import SelectUser from "@/components/UserSelect";

const ArticleForm = ({ isUpdateForm = false, entity }) => (
    <ArticleProvider>
        <ArticleFormComponent isUpdateForm={isUpdateForm} entity={entity} />
    </ArticleProvider>
);

function ArticleFormComponent({ isUpdateForm = false, entity }) {
    const forceUpdate = useForceUpdate();
    const validator = useRef(new Validator({ autoForceUpdate: { forceUpdate } }));
    const dispatch = useDispatchArticle();
    const _stepCount = useArticle((e) => e.stepCount);
    const { isDeleted, verified, user_id } = useArticle((e) => e);
    const _article = useArticle((e) => e.article);
    const _loading = useArticle((e) => e.loading);
    const updateArticle = useSelector(selectUpdatedItem);
    const DISPATCH = useDispatch();

    useEffect(() => {
        if (updateArticle.current?.article && isUpdateForm) {
            dispatch({
                type: "SET_ARTICLE",
                payload: {
                    article: updateArticle.current.article,
                    user_id: updateArticle.current.user_id,
                    isDeleted: updateArticle.current.isDeleted,
                    verified: updateArticle.current.verified,
                    method: "edit",
                },
            });
        } else {
            dispatch({ type: "SET_ARTICLE", payload: { method: "create" } });
        }
    }, [updateArticle.current]);

    const handleSteps = (event, publish) => {
        if (event === "back") {
            dispatch({ type: "UPDATE_STEP_COUNT", payload: "decrease" });
        } else if (event === "next") {
            if (validator?.current?.allValid()) {
                validator?.current?.hideMessages()
                dispatch({ type: "UPDATE_STEP_COUNT", payload: "increase", publish });
            } else validator?.current?.showMessages()
        }
    };


    function handleSuccess() {
        dispatch({ type: "RESET_ARTICLE", payload: { method: "create" } });
    }

    useEffect(() => {
        if (isUpdateForm) {
            dispatch({ type: "SET_ARTICLE", payload: { method: "edit" } });
        } else {
            dispatch({ type: "SET_ARTICLE", payload: { method: "create" } });
        }
    }, []);

    useEffect(() => {
        if (_loading === "loading") {
            const { formData } = articleConfiguration({
                user_id: user_id,
                article: _article,
                isDeleted: isDeleted,
                verified: verified,
            });
            const type = "multipart/form-data";
            if (updateArticle.current && isUpdateForm) {
                const id = updateArticle.current._id;
                const res = DISPATCH(crud.update(entity, id, formData, type));
                res.then(handleSuccess);
            } else {
                const res = DISPATCH(crud.create(entity, formData, type));
                res.then(handleSuccess);
            }
        }
    }, [_loading]);

    function handleSelects(value, name) {
        dispatch({
            type: "UPDATE_STATE",
            payload: { name: name, value: value },
        });
    }

    return (
        <>
            <CommonInput label="Select User" required
                hasError={validator?.current?.message("User", user_id, "required")}>
                <SelectUser value={user_id} onChange={handleSelects} />
            </CommonInput>
            <CommonInput label="Select Deleted Status" required
                hasError={validator?.current?.message("Delete status", isDeleted, "required")}>
                <Select
                    defaultValue={false}
                    onChange={(value) => handleSelects(value, "isDeleted")}
                    placeholder="Set Deleted Status"
                    style={{ width: "100%", marginBottom: "15px" }}
                    value={isDeleted}
                >
                    <Select.Option value={false}>Not Deleted</Select.Option>
                    <Select.Option value={true}>Deleted</Select.Option>
                </Select>
            </CommonInput>
            <CommonInput label="Select Verification Status" required hasError={validator?.current?.message("Verified", verified, "required")}>
                <Select
                    defaultValue={false}
                    onChange={(value) => handleSelects(value, "verified")}
                    placeholder="Set Verification Status"
                    style={{ width: "100%", marginBottom: "15px" }}
                    value={verified}
                >
                    <Select.Option value={false}>Not Verified</Select.Option>
                    <Select.Option value={true}>Verified</Select.Option>
                </Select>
            </CommonInput>
            <StepsOfArticle validator={validator} />
            <div>
                <div>
                    <Button
                        disabled={_stepCount === 0}
                        onClick={() => handleSteps("back")}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={() => handleSteps("next")}
                        sx={{ marginRight: "5px" }}
                    >
                        Add Paragraph
                    </Button>
                </div>
                <div className="article-publish">
                    <Button
                        onClick={() => handleSteps("next", "publish")}
                        loading={_loading === "loading"}
                        disabled={_stepCount < 2}
                        type="primary"
                    >
                        Publish
                    </Button>
                </div>
            </div>
        </>
    );
}

export default ArticleForm;
