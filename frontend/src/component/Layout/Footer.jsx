import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#2ab6ac] text-white p-6 text-center mt-auto">
      <h2 className="text-2xl font-semibold">Note10p</h2>
      <p className="mt-2 text-sm">Taking Notes in 2025.</p>
      <p className="mt-1 text-sm">
        © {new Date().getFullYear()} Note10p. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
