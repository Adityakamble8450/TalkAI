import React, { useEffect } from "react";
import { useChat } from "../hooks/Usechat";
import { useSelector } from "react-redux";

const Dashborad = () => {
  const { user } = useSelector((state) => state.auth);
  const { connectSocket, disconnectSocket } = useChat();

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashborad;
