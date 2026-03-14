import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBook, FaChartLine, FaBullseye, FaRocket } from "react-icons/fa";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const features = [
    {
      icon: FaBook,
      title: "Create Courses",
      description: "Build custom learning paths using YouTube videos",
    },
    {
      icon: FaChartLine,
      title: "Track Progress",
      description:
        "Monitor your learning journey with visual progress tracking",
    },
    {
      icon: FaBullseye,
      title: "Stay Organized",
      description: "Keep all your learning materials in one place",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-10"
      style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      }}
    >
      <div className="text-center max-w-4xl mx-auto animate-fadeIn">
        {/* Hero */}
        <div className="mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <FaRocket className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Welcome to <span className="block">FreeSkill</span>
          </h1>
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Create personalized learning courses with YouTube videos, track your
            progress, and master new skills at your own pace.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: "white", color: "#3b82f6" }}
            >
              <FaRocket className="w-4 h-4" />
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/10"
              style={{ border: "2px solid white", color: "white" }}
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="rounded-xl p-5 transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <feature.icon className="text-2xl mx-auto mb-3" />
              <h3 className="text-base font-bold mb-2">{feature.title}</h3>
              <p className="text-xs opacity-90 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Ready to Start Learning?
          </h2>
          <p className="text-sm mb-5 opacity-90">
            Join thousands of learners already using FreeSkill
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            style={{ background: "white", color: "#3b82f6" }}
          >
            <FaRocket className="w-4 h-4" />
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
