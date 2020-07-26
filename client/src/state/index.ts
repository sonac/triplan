import * as React from "react";
import globalHook, { Store } from "use-global-hook";
import { IPlan } from "components/Body/AllPlans";
import { Activity } from "components/Body/Activity";

export type State = {
  page: string;
  authModal: null | string;
  activityModal: null | Activity;
  user: null | User;
  plans: IPlan[] | null;
};

export type Actions = {
  changePage: (page: string) => void;
  authModalSwitch: () => void;
  activityModalSwitch: () => void;
  setUser: () => void;
  setPlans: (plans: IPlan[]) => void;
};

const changePage = (store: Store<State, Actions>, page: string) => {
  store.setState({ ...store.state, page });
};

const authModalSwitch = (store: Store<State, Actions>, authAction: string) => {
  store.setState({ ...store.state, authModal: authAction });
};

const activityModalSwitch = (store: Store<State, Actions>, activityAction: Activity) => {
  store.setState({ ...store.state, activityModal: activityAction})
}

const setUser = (store: Store<State, Actions>, user: User) => {
  store.setState({ ...store.state, user: user });
};

const setPlans = (store: Store<State, Actions>, plans: IPlan[]) => {
  store.setState({ ...store.state, plans: plans });
};

const initialState: State = {
  page: "MY PLAN",
  authModal: null,
  activityModal: null,
  user: null,
  plans: null,
};

export const actions = {
  changePage,
  authModalSwitch,
  activityModalSwitch,
  setUser,
  setPlans,
};

export const useGlobal = globalHook<State, Actions>(
  React,
  initialState,
  actions
);

export interface User {
  email: string;
  connectedToStrava: Boolean;
  activities: Array<Activity>;
  createdOn: string;
}
