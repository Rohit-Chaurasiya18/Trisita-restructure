import React, { useEffect } from "react";
import {
  Computer,
  Science,
  AccountBalance,
  Favorite,
  School,
} from "@mui/icons-material"; // using MUI icons instead of Lucide

const companies = [
  {
    name: "Autodesk AutoCAD Revit Architecture Suite",
    color: "blue",
    icon: <Computer fontSize="large" className="icon blue" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
  {
    name: "AutoCAD",
    color: "purple",
    icon: <Science fontSize="large" className="icon purple" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
  {
    name: "Civil 3D",
    color: "emerald",
    icon: <AccountBalance fontSize="large" className="icon emerald" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
  {
    name: "Autodesk AutoCAD Revit Architecture Suite",
    color: "blue",
    icon: <Computer fontSize="large" className="icon blue" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
  {
    name: "AutoCAD",
    color: "purple",
    icon: <Science fontSize="large" className="icon purple" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
  {
    name: "Civil 3D",
    color: "emerald",
    icon: <AccountBalance fontSize="large" className="icon emerald" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
  {
    name: "Autodesk AutoCAD Revit Architecture Suite",
    color: "blue",
    icon: <Computer fontSize="large" className="icon blue" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
  {
    name: "AutoCAD",
    color: "purple",
    icon: <Science fontSize="large" className="icon purple" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
  {
    name: "Civil 3D",
    color: "emerald",
    icon: <AccountBalance fontSize="large" className="icon emerald" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
  {
    name: "Autodesk AutoCAD Revit Architecture Suite",
    color: "blue",
    icon: <Computer fontSize="large" className="icon blue" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
  {
    name: "AutoCAD",
    color: "purple",
    icon: <Science fontSize="large" className="icon purple" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
  {
    name: "Civil 3D",
    color: "emerald",
    icon: <AccountBalance fontSize="large" className="icon emerald" />,
    jobs: [
      { role: "Demo 1", count: 12 },
      { role: "Demo 2", count: 3 },
      { role: "Demo 3", count: 5 },
      { role: "Demo 4", count: 7 },
    ],
  },
];

const ProductKnowledge = () => {
  useEffect(() => {
    // Apply fade-in animation delays dynamically
    document.querySelectorAll(".fade-in").forEach((el, index) => {
      el.style.animationDelay = `${(index + 1) * 0.1}s`;
    });
  }, []);
  return (
    <>
      <div className="mb-4">
        <div className="commom-header-title mb-0">Product Knowledge</div>
        <span className="common-breadcrum-msg">View all the product</span>
      </div>

      <div className="career-cards">
        <main className="cards-grid">
          {companies.map((company, index) => (
            <div
              key={company.name}
              className={`card-hover fade-in`}
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            >
              <div className="card-header">
                <div className={`logo-container ${company.color}`}>
                  {company.icon}
                </div>
                <h2>{company.name}</h2>
              </div>

              <div className="job-list">
                {company.jobs.map((job) => (
                  <div key={job.role} className="job-item">
                    <span>{job.role}</span>
                    <span className={`badge ${company.color}`}>
                      {job.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </>
  );
};

export default ProductKnowledge;
