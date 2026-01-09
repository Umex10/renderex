"use client"

import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, RootState } from "./store";


/**
 * Props for the StoreProvider component.
 * @interface StoreProviderProps
 * @property {React.ReactNode} children - The child components that will have access to the Redux store.
 */
interface StoreProviderProps {
  children: React.ReactNode,
  preloadedState?: Partial<RootState>; 
}

/**
 * A wrapper component that provides the Redux store to the application.
 * Should be used at the root of the application or where Redux state access is needed.
 * 
 * @component
 * @param {StoreProviderProps} args - The component arguments.
 * @param {React.ReactNode} args.children - The child components to render within the provider.
 * @returns {JSX.Element} The Provider component wrapping the children.
 */
export default function StoreProvider({ children, preloadedState }: StoreProviderProps) {

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  })

  return <Provider store={store}>{children}</Provider>;
}