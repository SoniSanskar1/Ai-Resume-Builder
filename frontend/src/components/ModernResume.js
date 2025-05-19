import React from "react";
import "./ModernResume.css";

const isPrimitive = (val) =>
  typeof val === "string" || typeof val === "number" || typeof val === "boolean";

const prettifyLabel = (label) =>
  label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const ModernResume = ({ data }) => {
  if (!data) return null;

  const {
    fullName,
    title,
    email,
    phone,
    address,
    summary,
    educationList = [],
    experienceList = [],
    styleConfig = {},
  } = data;

  const skills = Array.isArray(data.skills)
    ? data.skills
    : data.skills?.split(",") || [];

  const additionalSkills = Array.isArray(data.additionalSkills)
    ? data.additionalSkills
    : data.additionalSkills?.split(",") || [];

  const hobbies = Array.isArray(data.hobbies)
    ? data.hobbies
    : data.hobbies?.split(",") || [];

  // Extract style config with defaults
  const {
    fontFamily = "Arial, sans-serif",
    fontSize = "16px",
    headingColor = "#000",
    headingSize = "20px",
    headingWeight = "bold",
    textColor = "#000",
    backgroundColor = "#fff",
    topBarColor = "#2a2a2a",
    leftColumnColor = "#f0f0f0",
    rightColumnColor = "#ffffff",
    footerColor = "#f5f5f5",

    // NEW support
    nameFontFamily = fontFamily,
    nameFontSize = "28px",
    nameFontStyle = "normal",
    nameFontWeight = "bold",
    titleFontSize = "18px",
    titleFontStyle = "normal",
    summaryFontStyle = "normal",
    headingFontSize = headingSize,
  } = styleConfig;

  const knownFields = new Set([
    "fullName",
    "title",
    "email",
    "phone",
    "address",
    "summary",
    "skills",
    "additionalSkills",
    "hobbies",
    "educationList",
    "experienceList",
    "styleConfig",
  ]);

  const renderDynamicSections = () => {
    return Object.entries(data)
      .filter(([key, val]) => !knownFields.has(key) && val && val.length !== 0)
      .map(([key, val]) => (
        <section key={key}>
          <h3 style={{ fontSize: headingFontSize }}>{prettifyLabel(key)}</h3>
          {Array.isArray(val) ? (
            val.map((item, i) =>
              isPrimitive(item) ? (
                <p key={i}>• {item}</p>
              ) : (
                <div key={i} className="entry">
                  {Object.entries(item).map(([k, v]) => (
                    <p key={k}>
                      <strong>{prettifyLabel(k)}:</strong> {v}
                    </p>
                  ))}
                </div>
              )
            )
          ) : isPrimitive(val) ? (
            <p>{val}</p>
          ) : (
            Object.entries(val).map(([k, v]) => (
              <p key={k}>
                <strong>{prettifyLabel(k)}:</strong> {v}
              </p>
            ))
          )}
        </section>
      ));
  };

  return (
    <div
      id="resume-template"
      className="modern-resume upgraded"
      style={{
        fontFamily,
        fontSize,
        color: textColor,
        backgroundColor,
      }}
    >
      <div
        className="resume-header"
        style={{ backgroundColor: topBarColor, color: "#fff", padding: "20px" }}
      >
        <h1
          style={{
            fontFamily: nameFontFamily,
            fontSize: nameFontSize,
            fontStyle: nameFontStyle,
            fontWeight: nameFontWeight,
            margin: 0,
          }}
        >
          {fullName}
        </h1>
        <h2
          style={{
            fontSize: titleFontSize,
            fontStyle: titleFontStyle,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>

      <div className="resume-body">
        <div
          className="left-column"
          style={{ backgroundColor: leftColumnColor, padding: "20px" }}
        >
          {additionalSkills.length > 0 && (
            <section>
              <h3 style={{ fontSize: headingFontSize }}>Additional Skills</h3>
              <ul>
                {additionalSkills.map((skill, i) => (
                  <li key={i}>{skill.trim()}</li>
                ))}
              </ul>
            </section>
          )}

          {hobbies.length > 0 && (
            <section>
              <h3 style={{ fontSize: headingFontSize }}>Hobbies</h3>
              <p>{hobbies.join(", ")}</p>
            </section>
          )}

          <section>
            <h3 style={{ fontSize: headingFontSize }}>Contact</h3>
            <ul>
              {email && <li><strong>Email:</strong> {email}</li>}
              {phone && <li><strong>Phone:</strong> {phone}</li>}
              {address && <li><strong>Address:</strong> {address}</li>}
            </ul>
          </section>
        </div>

        <div
          className="right-column"
          style={{ backgroundColor: rightColumnColor, padding: "20px" }}
        >
          {summary && (
            <section>
              <h3 style={{ fontSize: headingFontSize }}>About Me</h3>
              <p style={{ fontStyle: summaryFontStyle }}>{summary}</p>
            </section>
          )}

          {experienceList.length > 0 && (
            <section>
              <h3 style={{ fontSize: headingFontSize }}>Experience</h3>
              {experienceList.map((exp, i) => (
                <div key={i} className="entry">
                  <strong>{exp.position}</strong>
                  {exp.company && ` at ${exp.company}`}<br />
                  {exp.startDate && exp.endDate && (
                    <small>{exp.startDate} – {exp.endDate}</small>
                  )}
                  <p>{exp.description}</p>
                </div>
              ))}
            </section>
          )}

          {educationList.length > 0 && (
            <section>
              <h3 style={{ fontSize: headingFontSize }}>Education</h3>
              {educationList.map((edu, i) => (
                <div key={i} className="entry">
                  <strong>{edu.degree}</strong><br />
                  <span>{edu.school} | {edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h3 style={{ fontSize: headingFontSize }}>Skills</h3>
              <ul>
                {skills.map((skill, i) => (
                  <li key={i}>{skill.trim()}</li>
                ))}
              </ul>
            </section>
          )}

          {renderDynamicSections()}
        </div>
      </div>

      <div
        className="resume-footer"
        style={{
          backgroundColor: footerColor,
          padding: "10px",
          textAlign: "center",
          fontSize: "12px",
        }}
      >
        Generated by AI Resume Builder
      </div>
    </div>
  );
};

export default ModernResume;