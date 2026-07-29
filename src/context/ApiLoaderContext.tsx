"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ShieldCheck } from "lucide-react";

interface ApiLoaderContextType {
  isLoading: boolean;
}

const ApiLoaderContext = createContext<ApiLoaderContextType>({
  isLoading: false,
});

function LoaderOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2.5px] transition-all duration-300 animate-in fade-in">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/90 px-8 py-6 shadow-2xl border border-slate-200/50 backdrop-blur-md">
        <div className="relative flex h-14 w-14 items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-[3.5px] border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-[3.5px] border-indigo-600 border-t-transparent animate-spin"></div>
          {/* Brand Logo Icon */}
          <ShieldCheck className="h-6 w-6 text-indigo-600 animate-pulse" strokeWidth={2.5} />
        </div>
        <span className="text-[10px] font-bold text-slate-700 tracking-[0.2em] uppercase mt-1 animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
}

export function ApiLoaderProvider({ children }: { children: ReactNode }) {
  const [activeRequests, setActiveRequests] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      setActiveRequests((prev) => prev + 1);
      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        throw error;
      } finally {
        setActiveRequests((prev) => Math.max(0, prev - 1));
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const isLoading = activeRequests > 0;

  return (
    <ApiLoaderContext.Provider value={{ isLoading }}>
      {children}
      {isLoading && <LoaderOverlay />}
    </ApiLoaderContext.Provider>
  );
}

export function useApiLoader() {
  return useContext(ApiLoaderContext);
}
