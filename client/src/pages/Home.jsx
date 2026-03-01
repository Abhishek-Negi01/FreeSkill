import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBook, FaChartLine, FaBullseye } from "react-icons/fa";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: FaBook,
      title: "Create Course",
      description: "Build custom learning paths using YouTube videos",
    },
    {
      icon: FaChartLine,
      title: "Track Progress",
      description: "Monitor your learning journey with progress tracking",
    },
    {
      icon: FaBullseye,
      title: "Stay Organized",
      description: "Keep all your learning materials in one place",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          {" "}
          Welcome to FreeSkill
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Create personalized learning courses with YouTube videos, track your
          progress, and master new skills at your own pace.
        </p>

        <div className="flex gap-4 justify-center ">
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            Login
          </Link>
        </div>

        {/* features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition"
            >
              <feature.icon className="text-4xl mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>

              <p className="text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
