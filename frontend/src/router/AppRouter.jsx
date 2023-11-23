import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "@/components/PageLoader";
import { useSelector } from "react-redux";
import { selectCurrentAdmin } from "@/redux/auth/selectors";

const Dashboard = lazy(() =>
    import(/*webpackChunkName:'DashboardPage'*/ "@/pages/Dashboard")
);
const Admin = lazy(() =>
    import(/*webpackChunkName:'AdminPage'*/ "@/pages/Admin")
);
const Roles = lazy(() =>
    import(/*webpackChunkName:'AdminPage'*/ "@/pages/Roles")
);
const Post = lazy(() =>
    import(/*webpackChunkName:'PostPage'*/ "@/pages/Post")
);

const Crypto = lazy(() =>
    import(/*webpackChunkName:'PostPage'*/ "@/pages/Crypto")
);

const News = lazy(() =>
    import(/*webpackChukName:'PostPage'*/ "@/pages/News")
);

const NewsCategorty = lazy(() =>
    import(/*webpackChukName:'NewsCategoryPage'*/ "@/pages/NewsCategory")
)

const Contact = lazy(() =>
    import(/*webpackChukName:'NewsCategoryPage'*/ "@/pages/Contact")
)

const CryptoHistory = lazy(() =>
    import(/*webpackChukName:'Cryptohistory'*/ "@/pages/CryptoHistory")
);
const SelectPost = lazy(() =>
    import(/*webpackChunkName:'SelectCustomerPage'*/ "@/pages/SelectPost")
);

const Profile = lazy(() =>
    import(/*webpackChunkName:'ProfilePage'*/ "@/pages/Profile")
);

const Article = lazy(() =>
    import(/*webpackChunkName:'ArticlePage'*/ "@/pages/Article")
);

const Travelplan = lazy(() =>
    import(/*webpackChunkName:'TravelplanPage'*/ "@/pages/Travelplan")
);

const Price = lazy(() =>
    import(/*webpackChunkName:'PricePage'*/"@/pages/Price")
)

const CoinDynamic = lazy(() =>
    import(/*webpackChunkName:'PricePage'*/"@/pages/CoinDynamic")
)



const CoinStatic = lazy(() =>
    import(/*webpackChunkName:'PricePage'*/"@/pages/CoinStatic")
)

const Error = lazy(() =>
    import(/*webpackChunkName:'PricePage'*/ "@/pages/Error")
)
const Logout = lazy(() =>
    import(/*webpackChunkName:'LogoutPage'*/ "@/pages/Logout")
);
const NotFound = lazy(() =>
    import(/*webpackChunkName:'NotFoundPage'*/ "@/pages/NotFound")
);


export default function AppRouter() {
    const location = useLocation();
    const user = useSelector(selectCurrentAdmin);
    return (
        <Suspense fallback={<PageLoader />}>
            <AnimatePresence exitBeforeEnter initial={false}>
                <Switch location={location} key={location.pathname}>
                    <PrivateRoute path="/" component={Dashboard} exact />
                    <PrivateRoute component={Post} path="/posts" exact />
                    <PrivateRoute
                        component={SelectPost}
                        path="/selectpost"
                        exact
                    />
                    <PrivateRoute component={Profile} path="/profiles" exact />
                    <PrivateRoute component={Contact} path="/contact" exact />
                    <PrivateRoute component={Article} path="/articles" exact />
                    <PrivateRoute component={Travelplan} path="/travelplans" exact />
                    <PrivateRoute component={Crypto} path="/crypto" exact />
                    <PrivateRoute component={CryptoHistory} path="/cryptohistory" exact />
                    <PrivateRoute component={NewsCategorty} path="/newscategory" exact />
                    <PrivateRoute component={News} path="/news" exact />
                    <PrivateRoute component={Price} path="/price" exact />
                    <PrivateRoute component={CoinDynamic} path="/coindynamic" exact />
                    <PrivateRoute component={CoinStatic} path="/coinstatic" exact />
                    <PrivateRoute component={Error} path="/error" exact />
                    {user?.isSuperAdmin && <>
                        <PrivateRoute component={Roles} path="/roles" exact />
                        <PrivateRoute component={Admin} path="/admins" exact />
                    </>}
                    <PrivateRoute component={Logout} path="/logout" exact />
                    <PublicRoute path="/login" render={() => <Redirect to="/" />} />
                    <Route
                        path="*"
                        component={NotFound}
                        render={() => <Redirect to="/notfound" />}
                    />
                </Switch>
            </AnimatePresence>
        </Suspense>
    );
}
