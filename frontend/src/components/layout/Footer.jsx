import React from 'react';

export const Footer = () => {
  return (
    <footer className="footer-pastel text-light py-4 mt-auto">
      <div className="container text-center">
        <div className="row gy-3 align-items-center">
          <div className="col-md-6 text-md-start">
            <span className="fw-bold text-white fs-6">🏨 FUMiniHotel Management System</span>
            <div className="small text-white-50 mt-1">
              Assignment 03 – Securing REST Services with Spring Boot & ReactJS
            </div>
          </div>
          <div className="col-md-6 text-md-end text-white-50 small">
            <div>© {new Date().getFullYear()} A3OanhTP_SE1910. All rights reserved.</div>
            <div>Built with Spring Boot 3, MS SQL Server & React</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

