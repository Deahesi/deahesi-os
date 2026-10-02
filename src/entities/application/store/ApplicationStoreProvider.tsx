"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "zustand";

import {
  createApplicationStore,
  type ApplicationStoreApi,
  type ApplicationStoreState,
} from "./application-store";

const ApplicationStoreContext = createContext<ApplicationStoreApi | null>(null);

type ApplicationStoreProviderProps = {
  children: ReactNode;
};

export function ApplicationStoreProvider({
  children,
}: ApplicationStoreProviderProps) {
  const [store] = useState(createApplicationStore);

  useEffect(() => {
    void Promise.resolve(store.persist.rehydrate()).finally(() => {
      store.setState({ hydrated: true });
    });
  }, [store]);

  return (
    <ApplicationStoreContext.Provider value={store}>
      {children}
    </ApplicationStoreContext.Provider>
  );
}

export function useApplicationStore<T>(
  selector: (state: ApplicationStoreState) => T,
): T {
  const store = useContext(ApplicationStoreContext);

  if (!store) {
    throw new Error("useApplicationStore requires ApplicationStoreProvider");
  }

  return useStore(store, selector);
}
