import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { home, notifications, person } from "ionicons/icons";

import Notification from "../Main/Notification/Notification";
import Job from "../Main/Job/Job";
import Profile from "../Main/Profile/Profile";

const tabs = [
  {
    path: "/tabs/notification",
    icon: notifications,
    tab: "notification",
    component: Notification,
  },
  { path: "/tabs/job", icon: home, tab: "job", component: Job },
  { path: "/tabs/profile", icon: person, tab: "profile", component: Profile },
];

const Tabs = () => (
  <IonTabs>
    <IonRouterOutlet>
      {tabs.map(({ path, component }, index) => (
        <Route key={index} exact path={path} component={component} />
      ))}
      <Route exact path="/tabs">
        <Redirect to="/tabs/job" />
      </Route>
    </IonRouterOutlet>

    <IonTabBar color="dark" slot="bottom">
      {tabs.map(({ path, icon, tab }, index) => (
        <IonTabButton key={index} tab={tab} href={path}>
          <IonIcon size="small" icon={icon} />
        </IonTabButton>
      ))}
    </IonTabBar>
  </IonTabs>
);

export default Tabs;
