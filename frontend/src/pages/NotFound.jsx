import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page-container">
      <div className="state-message empty-state">
        <h1 className="notfound-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page or inventory record you requested does not exist.</p>
        <Link to="/products" className="btn btn-primary">
          Return to Products
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
