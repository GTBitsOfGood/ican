import React from "react";
import { useUser } from "./UserContext";
import { useNotifications } from "./hooks/useNotifications";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId } = useUser();
  useNotifications(userId);

  return <>{children}</>;
};
