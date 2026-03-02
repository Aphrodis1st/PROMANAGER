import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const show = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      {message && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-xl shadow">
          {message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () =>
  useContext(NotificationContext);