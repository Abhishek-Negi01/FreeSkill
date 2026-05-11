import React, { createContext, useContext, useCallback } from "react";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const showSuccess = useCallback((message, options = {}) => {
    toast.success(message, options);
  }, []);

  const showError = useCallback((message, options = {}) => {
    toast.error(message, options);
  }, []);

  const showInfo = useCallback((message, options = {}) => {
    toast(message, { icon: "ℹ️", ...options });
  }, []);

  const showWarning = useCallback((message, options = {}) => {
    toast(message, { icon: "⚠️", ...options });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
