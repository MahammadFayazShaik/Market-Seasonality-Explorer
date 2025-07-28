import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section project-info">
          <h3>📊 Market Seasonality Explorer</h3>
          <p>
            A data-driven web app for exploring financial market trends with interactive calendar views, charts, and AI-powered insights.
          </p>
        </div>

        <div className="footer-section tech-stack">
          <h4>🔧 Built With</h4>
          <p>ReactJS, Recharts, Binance API, JavaScript, HTML5, CSS3</p>
        </div>

        <div className="footer-section author-info">
          <p>
            © {new Date().getFullYear()} Mahammad Fayaz ·{" "}
            <a
              href="https://portfolio-itsmefayaz.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
