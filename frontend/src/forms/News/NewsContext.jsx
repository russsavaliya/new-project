/**
 * =========================================================================================
 *  Create News - Context
 * =========================================================================================
 */

import React, { useContext, useReducer } from "react";

const NewsStep = 4;
const initialNews = new Array(NewsStep).fill({
    title: "",
    tags: "",
    paragraph: "",
    media_type: "",
    media_url: "",
    video_url: "",
    embed_code: "",
    media_credit: "",
});

const News = React.createContext(undefined);
const NewsUpdateContext = React.createContext(undefined);

const initialState = {
    method: "create",
    news: initialNews,
    stepCount: 0,
    user_id: "",
    isDeleted: false,
    verified: false,
    error: initialNews,
    errors: {
        user_id: "",
        isDeleted: "",
        verified: "",
    },
    loader: "",
};

const NewsReducer = (state, action) => {
    switch (action.type) {
        case "SET_news": {
            return { ...state, ...action.payload };
        }
        case "UPDATE_STEP_COUNT": {
            let stepCount = state.stepCount;
            let loading = state.loading;
            let hasError = false;
            let error = JSON.parse(JSON.stringify([...state.error]));
            let errors = JSON.parse(JSON.stringify({ ...state.errors }));
            let news = [...state.news];
            if (action.payload === "decrease") {
                stepCount = stepCount - 1;
            } else {
                if (news[stepCount].title) {
                    error[stepCount].title = "";
                    if (
                        news[stepCount].title.length >= 2 &&
                        news[stepCount].title.length <= 80
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
                    errors.user_id = "Please select the user of the news";
                    hasError = true;
                }
                if (state.isDeleted !== "") {
                    errors.isDeleted = "";
                } else {
                    errors.isDeleted = "Please select news's deleted status";
                    hasError = true;
                }
                if (state.verified !== "") {
                    errors.verified = "";
                } else {
                    errors.verified = "Please select news's verification status";
                    hasError = true;
                }

                if (news[stepCount].paragraph) {
                    if (
                        news[stepCount].paragraph.length >= 4 &&
                        news[stepCount].paragraph.length <= 250
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
                if (news[stepCount].media_type) {
                    error[stepCount].media_type = "";
                    if (news[stepCount].media) {
                        if (
                            news[stepCount].media_type === "embed_code" ||
                            news[stepCount].media_type === "video_url"
                        ) {
                            delete news[stepCount].media;
                        } else {
                            news[stepCount].embed_code = "";
                            news[stepCount].video_url = "";
                        }
                    }
                    if (news[stepCount].media_type === "embed_code") {
                        news[stepCount].video_url = "";
                    } else if (news[stepCount].media_type === "video_url") {
                        news[stepCount].embed_code = "";
                    }
                }
                if (!hasError) {
                    if (action.publish) {
                        loading = "loading";
                    }
                    // get total step from config file
                    else if (stepCount < NewsStep - 1) stepCount = stepCount + 1;
                    else {
                        loading = "loading";
                    }
                }
            }
            return { ...state, stepCount, error, errors, news, loading };
        }
        case "RESET_news": {
            state = initialState;
            return { ...state };
        }
        case "SET_ERROR_MESSAGE": {
            const error = JSON.parse(JSON.stringify([...state.error]));
            if (Array.isArray(action.payload)) {
                action.payload.map((data) => {
                    error[state.stepCount][data.name] = data.value;
                    return data;
                });
            } else {
                const { name, value } = action.payload;
                error[state.stepCount][name] = value;
            }
            return { ...state, error };
        }
        case "UPDATE_news": {
            const newsObj = { ...state.news[state.stepCount] }
            if (Array.isArray(action.payload)) {
                action.payload.map(data => {
                    newsObj[data.name] = data.value
                    return data
                })
            } else {
                const { name, value } = action.payload
                newsObj[name] = value
            }
            const news = [...state.news]
            news[state.stepCount] = newsObj
            return { ...state, news }
        }
        case "UPDATE_STATE": {
            let newState = { ...state };
            const { name, value } = action.payload;
            newState[name] = value;
            newState.errors[name] = "";
            return { ...newState };
        }
        default:
            throw new Error();
    }
};

export const useNews = (cb) => {
    return cb(useContext(News));
};

export const useDispatchNews = () => {
    return useContext(NewsUpdateContext);
};

export function NewsProvider(props) {
    const [state, dispatch] = useReducer(NewsReducer, initialState);
    return (
        <News.Provider value={state}>
            <NewsUpdateContext.Provider value={dispatch}>
                {props.children}
            </NewsUpdateContext.Provider>
        </News.Provider>
    );
}

export const NewsConfiguration = (data) => {
    let mediaList = {};
    const { news, ...info } = data;

    for (let i = 0; i < NewsStep - 1; i++) {
        if (news[i].media) {
            if (i === 0) mediaList.media = news[i].media;
            else mediaList["media" + i] = news[i].media;
            delete news[i].media;
        }
    }
    const formData = new FormData();
    formData.append(
        "postdata",
        JSON.stringify({ ...info, news: news })
    );
    Object.keys(mediaList).map((media) => {
        formData.append(`${media}`, mediaList[media]);
        return media;
    });
    return { formData };
};
