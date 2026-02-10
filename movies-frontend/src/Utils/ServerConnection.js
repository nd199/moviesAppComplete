import React from "react";
import "./ServerConnection.css";
import Lottie from "react-lottie";
import { ServerConnectingOptions } from "./AnimationData";

const ServerConnection = () => {
  return (
    <div className="sco-container">
      <div className="sco-content">
        <div className="sco-image">
          <Lottie options={ServerConnectingOptions} />
        </div>
        <div className="sco-BH">Checking Backend Health...</div>
        <p className="sco-text">
          <strong>Note</strong> : The Free Tier{" "}
          <span>
            <a
              href="https://render.com"
              target="_blank"
              style={{ fontWeight: "bold", fontStyle: "underlined", color: "black" }}
            >
              Render.com
            </a>
          </span> {" "}
          takes a few minutes to spin up. We appreciate your patience.
        </p>
      </div>
    </div>
  );
};

export default ServerConnection;
