// src/components/ModernResume.js
import React from "react";
import "./ModernResume.css";

const ModernResume = ({ data }) => {
  const skills = Array.isArray(data.skills)
    ? data.skills
    : data.skills?.split(",") || [];

  const additionalSkills = Array.isArray(data.additionalSkills)
    ? data.additionalSkills
    : data.additionalSkills?.split(",") || [];

  const educationList = Array.isArray(data.educationList)
    ? data.educationList
    : [];

  const experienceList = Array.isArray(data.experienceList)
    ? data.experienceList
    : [];

  return (
    <div id="resume-template" className="modern-resume upgraded">
      <div className="resume-header">
        <h1>{data.fullName}</h1>
        <h2>{data.title}</h2>
      </div>

      <div className="resume-body">
        <div className="left-column">
          {additionalSkills.length > 0 && (
            <section>
              <h3>Additional Skills</h3>
              <ul>
                {additionalSkills.map((skill, i) => (
                  <li key={i}>{skill.trim()}</li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h3>Hobbies</h3>
            <p>{Array.isArray(data.hobbies) ? data.hobbies.join(", ") : data.hobbies}</p>
          </section>

          <section>
            <h3>Contact</h3>
            <ul>
              {data.email && <li><strong>Email:</strong> {data.email}</li>}
              {data.phone && <li><strong>Phone:</strong> {data.phone}</li>}
              {data.address && <li><strong>Address:</strong> {data.address}</li>}
            </ul>
          </section>
        </div>

        <div className="right-column">
          <section>
            <h3>About Me</h3>
            <p>{data.summary}</p>
          </section>

          {experienceList.length > 0 && (
            <section>
              <h3>Experience</h3>
              {experienceList.map((exp, i) => {
                const isFresher = exp.position?.toLowerCase() === "fresher";
                const hasValidDates =
                  exp.startDate && exp.endDate &&
                  exp.startDate !== "N/A" && exp.endDate !== "N/A";
                const hasCompany = exp.company && exp.company !== "N/A";

                return (
                  <div key={i} className="entry">
                    <strong>{isFresher ? "Fresher" : exp.position}</strong>
                    {hasCompany && !isFresher && ` at ${exp.company}`}<br />
                    {hasValidDates && <small>{exp.startDate} – {exp.endDate}</small>}
                    <p>{exp.description}</p>
                  </div>
                );
              })}
            </section>
          )}

          {educationList.length > 0 && (
            <section>
              <h3>Education</h3>
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
              <h3>Skills</h3>
              <ul>
                {skills.map((s, i) => <li key={i}>{s.trim()}</li>)}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernResume;
