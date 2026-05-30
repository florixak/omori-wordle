"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type RequestHintFn = () => Promise<string | null>;

type GameActionsContextValue = {
  requestHint: () => Promise<string | null>;
  isAvailable: boolean;
};

type GameActionsRegistryContextValue = {
  registerRequestHint: (fn: RequestHintFn) => void;
  unregisterRequestHint: (fn: RequestHintFn) => void;
};

const GameActionsContext = createContext<GameActionsContextValue | null>(null);
const GameActionsRegistryContext =
  createContext<GameActionsRegistryContextValue | null>(null);

export const GameActionsProvider = ({ children }: { children: ReactNode }) => {
  const requestHintRef = useRef<RequestHintFn | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  const registerRequestHint = useCallback((fn: RequestHintFn) => {
    requestHintRef.current = fn;
    setIsAvailable(true);
  }, []);

  const unregisterRequestHint = useCallback((fn: RequestHintFn) => {
    if (requestHintRef.current !== fn) {
      return;
    }
    requestHintRef.current = null;
    setIsAvailable(false);
  }, []);

  const registryValue = useMemo(
    () => ({
      registerRequestHint,
      unregisterRequestHint,
    }),
    [registerRequestHint, unregisterRequestHint],
  );

  const requestHint = useCallback(async () => {
    if (!requestHintRef.current) {
      return null;
    }

    return requestHintRef.current();
  }, []);

  const actionsValue = useMemo(
    () => ({
      requestHint,
      isAvailable,
    }),
    [requestHint, isAvailable],
  );

  return (
    <GameActionsRegistryContext.Provider value={registryValue}>
      <GameActionsContext.Provider value={actionsValue}>
        {children}
      </GameActionsContext.Provider>
    </GameActionsRegistryContext.Provider>
  );
};

export const useGameActions = (): GameActionsContextValue | null => {
  return useContext(GameActionsContext);
};

export const useRegisterRequestHint = (requestHint: RequestHintFn): void => {
  const registry = useContext(GameActionsRegistryContext);
  const requestHintRef = useRef(requestHint);

  useEffect(() => {
    requestHintRef.current = requestHint;
  });

  useEffect(() => {
    if (!registry) {
      return;
    }

    const invokeLatestRequestHint = () => requestHintRef.current();

    registry.registerRequestHint(invokeLatestRequestHint);

    return () => {
      registry.unregisterRequestHint(invokeLatestRequestHint);
    };
  }, [registry]);
};
