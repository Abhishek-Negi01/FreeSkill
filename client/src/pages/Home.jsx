import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBook, FaChartLine, FaBullseye, FaRocket } from "react-icons/fa";

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
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      }}
    >
      <div className="text-center max-w-5xl mx-auto animate-fadeIn">
        {/* Hero Section */}
        <div className="mb-12">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-bounce"
            style={{ background: "rgba(255, 255, 255, 0.2)" }}
          >
            <FaRocket className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Welcome to <span className="block mt-2">FreeSkill</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Create personalized learning courses with YouTube videos, track your
            progress, and master new skills at your own pace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-base transition-all duration-300 shadow-xl hover:shadow-2xl"
              style={{
                background: "white",
                color: "#3b82f6",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <FaRocket />
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-base transition-all duration-300 shadow-xl hover:shadow-2xl"
              style={{
                background: "transparent",
                border: "2px solid white",
                color: "white",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 md:p-8 transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: feature.bgColor }}
              >
                <feature.icon
                  className="text-3xl"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div
          className="mt-16 p-8 rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-base md:text-lg mb-6 opacity-90">
            Join thousands of learners already using FreeSkill
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-base transition-all duration-300 shadow-xl hover:shadow-2xl"
            style={{
              background: "white",
              color: "#3b82f6",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FaRocket />
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
