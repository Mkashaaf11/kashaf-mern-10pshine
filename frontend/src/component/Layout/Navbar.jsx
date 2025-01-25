import React from "react";
import { Link } from "react-router-dom";
import { NotebookPen } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-[#2ab6ac]  text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <NotebookPen className="h-10 w-10 mr-2" />
        <h2 className="text-2xl font-bold">Note10P</h2>
      </div>
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/notes" className="hover:underline">
          Notes
        </Link>

        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
