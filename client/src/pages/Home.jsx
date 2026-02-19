import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to FreeSkill</h1>
      <p className="text-xl mb-8">
        Create personalized learning courses with YouTube videos
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
