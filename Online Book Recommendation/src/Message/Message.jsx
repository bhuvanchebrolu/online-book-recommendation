import React from "react";
import "./Message.css";
import { useMessage } from "../context/MessageContext";

export default function Message() {
  const { msg, hideMessage } = useMessage();

  if (!msg.text) return null;

  return (
    <div className={`message ${msg.type}`}>
      <span>{msg.text}</span>
      <button className="closeBtn" onClick={hideMessage}>
        &times;
      </button>
    </div>
  );
}