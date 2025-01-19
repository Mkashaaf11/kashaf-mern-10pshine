// component/Error/ErrorPage.js
import React from "react";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">Oops!...</h1>
        <p className="text-lg text-gray-700 mb-8">Something went wrong!</p>
        <p className="text-md text-gray-600 mb-8">
          We can't find the page you're looking for.
        </p>
        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
