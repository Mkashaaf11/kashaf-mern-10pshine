import React from "react";

const AuthLayout = ({ children, title }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full mx-auto space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
