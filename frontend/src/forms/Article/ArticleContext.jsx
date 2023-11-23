/**
 * =========================================================================================
 *  Create Article - Context
 * =========================================================================================
 */

import React, {useContext, useReducer} from "react";

const articleStep = 4;
const initialArticle = new Array(articleStep).fill({
    title: "",
    tags: "",
    paragraph: "",
    media_type: "",
    media_url: "",
    video_url: "",
    embed_code: "",
    media_credit: "",
});

const Article = React.createContext(undefined);
const ArticleUpdateContext = React.createContext(undefined);

const initialState = {
    method: "create",
    article: initialArticle,
    stepCount: 0,
    user_id: "",
    isDeleted: false,
    verified: false,
    error: initialArticle,
    errors: {
        user_id: "",
        isDeleted: "",
        verified: "",
    },
    loader: "",
};

const ArticleReducer = (state, action) => {
    switch (action.type) {
        case "SET_ARTICLE": {
            return {...state, ...action.payload};
        }
        case "UPDATE_STEP_COUNT": {
            let stepCount = state.stepCount;
            let loading = state.loading;
            let hasError = false;
            let error = JSON.parse(JSON.stringify([...state.error]));
            let errors = JSON.parse(JSON.stringify({...state.errors}));
            let article = [...state.article];
            if (action.payload === "decrease") {
                stepCount = stepCount - 1;
            } else {
                if (article[stepCount].title) {
                    error[stepCount].title = "";
                    if (
                        article[stepCount].title.length >= 2 &&
                        article[stepCount].title.length <= 80
                    )
                        error[stepCount].title = "";
                    else {
                        error[stepCount].title =
                            "Title length should be more than 2 and less than 80";
                        hasError = true;
                    }
                } else if (stepCount === 0) {
                    error[stepCount].title = "Title is required";
                    hasError = true;
                }
                if (state?.user_id && state.user_id.length > 0) {
                    errors.user_id = "";
                } else {
                    errors.user_id = "Please select the user of the article";
                    hasError = true;
                }
                if (state.isDeleted !== "") {
                    errors.isDeleted = "";
                } else {
                    errors.isDeleted = "Please select article's deleted status";
                    hasError = true;
                }
                if (state.verified !== "") {
                    errors.verified = "";
                } else {
                    errors.verified = "Please select article's verification status";
                    hasError = true;
                }

                if (article[stepCount].paragraph) {
                    if (
                        article[stepCount].paragraph.length >= 4 &&
                        article[stepCount].paragraph.length <= 250
                    )
                        error[stepCount].paragraph = "";
                    else {
                        error[stepCount].paragraph =
                            "Paragraph length should be more than 4 and less than 250";
                        hasError = true;
                    }
                } else if (stepCount < 3) {
                    error[stepCount].paragraph = "Paragraph is required";
                    hasError = true;
                }
                if (article[stepCount].media_type) {
                    error[stepCount].media_type = "";
                    if (article[stepCount].media) {
                        if (
                            article[stepCount].media_type === "embed_code" ||
                            article[stepCount].media_type === "video_url"
                        ) {
                            delete article[stepCount].media;
                        } else {
                            article[stepCount].embed_code = "";
                            article[stepCount].video_url = "";
                        }
                    }
                    if (article[stepCount].media_type === "embed_code") {
                        article[stepCount].video_url = "";
                    } else if (article[stepCount].media_type === "video_url") {
                        article[stepCount].embed_code = "";
                    }
                }
                if (!hasError) {
                    if (action.publish) {
                        loading = "loading";
                    }
                    // get total step from config file
                    else if (stepCount < articleStep - 1) stepCount = stepCount + 1;
                    else {
                        loading = "loading";
                    }
                }
            }
            return {...state, stepCount, error, errors, article, loading};
        }
        case "RESET_ARTICLE": {
            state = initialState;
            return {...state};
        }
        case "SET_ERROR_MESSAGE": {
            const error = JSON.parse(JSON.stringify([...state.error]));
            if (Array.isArray(action.payload)) {
                action.payload.map((data) => {
                    error[state.stepCount][data.name] = data.value;
                    return data;
                });
            } else {
                const {name, value} = action.payload;
                error[state.stepCount][name] = value;
            }
            return {...state, error};
        }
        case "UPDATE_ARTICLE": {
            const articleObj = {...state.article[state.stepCount]}
            if (Array.isArray(action.payload)) {
                action.payload.map(data => {
                    articleObj[data.name] = data.value
                    return data
                })
            } else {
                const {name, value} = action.payload
                articleObj[name] = value
            }
            const article = [...state.article]
            article[state.stepCount] = articleObj
            return {...state, article}
        }
        case "UPDATE_STATE": {
            let newState = {...state};
            const {name, value} = action.payload;
            newState[name] = value;
            newState.errors[name] = "";
            return {...newState};
        }
        default:
            throw new Error();
    }
};

export const useArticle = (cb) => {
    return cb(useContext(Article));
};

export const useDispatchArticle = () => {
    return useContext(ArticleUpdateContext);
};

export function ArticleProvider(props) {
    const [state, dispatch] = useReducer(ArticleReducer, initialState);
    return (
        <Article.Provider value={state}>
            <ArticleUpdateContext.Provider value={dispatch}>
                {props.children}
            </ArticleUpdateContext.Provider>
        </Article.Provider>
    );
}

export const articleConfiguration = (data) => {
    let mediaList = {};
    const {article, ...info} = data;

    for (let i = 0; i < articleStep - 1; i++) {
        if (article[i].media) {
            if (i === 0) mediaList.media = article[i].media;
            else mediaList["media" + i] = article[i].media;
            delete article[i].media;
        }
    }
    const formData = new FormData();
    formData.append(
        "postdata",
        JSON.stringify({...info, article: article})
    );
    Object.keys(mediaList).map((media) => {
        formData.append(`${media}`, mediaList[media]);
        return media;
    });
    return {formData};
};
