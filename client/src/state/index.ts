import * as React from "react";
import globalHook, { Store } from "use-global-hook";

export type State = {
  page: string;
  authModal: null | string;
  user: null | User;
};

export type Actions = {
  changePage: (page: string) => void;
  authModalSwitch: () => void;
  setUser: () => void;
};

const changePage = (store: Store<State, Actions>, page: string) => {
  store.setState({ ...store.state, page });
};

const authModalSwitch = (store: Store<State, Actions>, authAction: string) => {
  store.setState({ ...store.state, authModal: authAction });
};

const setUser = (store: Store<State, Actions>, user: User) => {
  store.setState({ ...store.state, user: user });
};

const initialState: State = {
  page: "MY PLAN",
  authModal: null,
  user: null,
};

export const actions = {
  changePage,
  authModalSwitch,
  setUser,
};

export const useGlobal = globalHook<State, Actions>(React, initialState, actions);

export interface User {
  email: string;
  createdOn: string;
}
