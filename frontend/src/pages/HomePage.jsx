import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth/signup");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col justify-center items-start p-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Turn to-do into done
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Bring your notes, tasks, and schedules together to get things done
          more easily.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-[#2ab6ac] text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
        >
          Get Started
        </button>
      </div>

      <div
        className="flex-1 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/image.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 flex justify-center items-center"></div>
      </div>
    </div>
  );
};

export default Home;
