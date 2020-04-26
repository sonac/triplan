import * as React from "react";
import globalHook, { Store } from "use-global-hook";

export type State = {
  page: string;
  authModal: null | string;
};

export type Actions = {
  changePage: (page: string) => void;
  authModalSwitch: () => void;
};

const changePage = (store: Store<State, Actions>, page: string) => {
  store.setState({ ...store.state, page });
};

const authModalSwitch = (store: Store<State, Actions>, authAction: string) => {
  store.setState({ ...store.state, authModal: authAction });
};

const initialState: State = {
  page: "MY PLAN",
  authModal: null,
};

export const actions = {
  changePage,
  authModalSwitch,
};

export const useGlobal = globalHook<State, Actions>(React, initialState, actions);

export interface User {
  id: string;
  name: string;
}
