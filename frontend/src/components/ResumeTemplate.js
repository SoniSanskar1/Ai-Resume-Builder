import React from "react";
import "./ResumeTemplate.css";

const ResumeTemplate = ({ content }) => {
  return (
    <div id="resume-template" className="resume-container">
      {content.split("\n").map((line, idx) => (
        <p key={idx}>{line}</p>
      ))}
    </div>
  );
};

export default ResumeTemplate; // ✅ THIS MUST BE DEFAULT EXPORT
