import * as React from "react";
import globalHook, { Store } from "use-global-hook";

export type State = {
  page: string;
  currentUser: User | null;
};

export type Actions = {
  changePage: (page: string) => void;
  login: (user: User) => void;
};

const changePage = (store: Store<State, Actions>, page: string) => {
  store.setState({ ...store.state, page });
};

const login = (store: Store<State, Actions>, user: User) => {
  store.setState({ ...store.state, user });
};

const initialState: State = {
  page: "MY PLAN",
  currentUser: null,
};

export const actions = {
  changePage,
  login,
};

export const useGlobal = globalHook<State, Actions>(
  React,
  initialState,
  actions
);

export interface User {
  id: string;
  name: string;
}
