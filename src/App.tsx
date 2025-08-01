import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonSpinner,
  IonText,
  IonToast,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

// Ionic styles
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "./theme/variables.css";
import "./assets/styles/app.css";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/Main/Login"));
const TabsLayout = lazy(() => import("./pages/Tabs/TabsLayout"));

// Context and layout
import { useAuthContext } from "./helpers/context/AuthContext";
import IonicLayout from "./components/Layouts/IonicLayout";
import ViewJob from "./pages/Main/Job/ViewJob";
import ViewNotification from "./pages/Main/Notification/ViewNotification";
import ProfileUpdateDetails from "./pages/Main/Profile/Profile-Update/ProfileUpdateDetails";
import ProfileUpdatePicture from "./pages/Main/Profile/Profile-Update/ProfileUpdatePicture";
import ProfileUpdateSkills from "./pages/Main/Profile/Profile-Update/ProfileUpdateSkills";
import ProfileUpdateCvResume from "./pages/Main/Profile/Profile-Update/Files/ProfileUpdateCvResume";
import ProfileUpdatePortfolio from "./pages/Main/Profile/Profile-Update/Files/ProfileUpdatePortfolio";
import { ToastProvider } from "./helpers/context/ToastContext";
import SplashScreen from "./pages/Other/SplashScreen";

setupIonicReact();

const App: React.FC = () => {
  const { user, loading, token, error } = useAuthContext();

  if (loading && window.location.pathname === "/login") return <SplashScreen />;
  if (loading) return <SplashScreen />;

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Suspense fallback={<SplashScreen />}>
            <Route
              path="/tabs"
              render={() => (user ? <TabsLayout /> : <Redirect to="/login" />)}
            />
            <Route
              exact
              path="/login"
              render={() => (user ? <Redirect to="/tabs/job" /> : <Login />)}
            />

            <Route
              path="/tabs/job/:id"
              render={(props) =>
                user ? <ViewJob {...props} /> : <Redirect to="/login" />
              }
            />
            <Route
              path={"/tabs/update/picture"}
              render={() =>
                user ? <ProfileUpdatePicture /> : <Redirect to={"/login"} />
              }
            />
            <Route
              path={"/tabs/update/details"}
              render={() =>
                user ? <ProfileUpdateDetails /> : <Redirect to={"/login"} />
              }
            />
            <Route
              path={"/tabs/update/skills"}
              render={() =>
                user ? <ProfileUpdateSkills /> : <Redirect to={"/login"} />
              }
            />
            <Route
              path={"/tabs/update/cvresume"}
              render={() =>
                user ? <ProfileUpdateCvResume /> : <Redirect to={"/login"} />
              }
            />
            <Route
              path={"/tabs/update/portfolio"}
              render={() =>
                user ? <ProfileUpdatePortfolio /> : <Redirect to={"/login"} />
              }
            />
            <Route
              path="/tabs/notification/:id"
              render={(props) =>
                user ? (
                  <ViewNotification {...props} />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />

            <Route
              exact
              path="/"
              render={() => <Redirect to={user ? "/tabs/job" : "/login"} />}
            />
          </Suspense>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
