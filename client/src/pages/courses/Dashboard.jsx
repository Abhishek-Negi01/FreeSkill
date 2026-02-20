import React, { useEffect, useState } from "react";
import { courseService } from "../../api/services/courses.js";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [showForm, setSetForm] = useState(false);

  const createCourse = (e) => {
    e.preventDefault();

    courseService
      .create({ title: courseTitle, description: courseDescription })
      .then((res) => {
        setCourses([...courses, res.data.data.course]);
        // console.log(res.data.data.course);
        setCourseTitle("");
        setCourseDescription("");
        setSetForm(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    courseService
      .getAll()
      .then((res) => {
        // console.log("Full response : ", res.data);
        setCourses(res.data.data.courses);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <button
          onClick={() => setSetForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Create Course"}
        </button>
      </div>

      {/* Create course form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Course</h2>
          <form onSubmit={createCourse}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Create Course
            </button>
          </form>
        </div>
      )}

      {/* all courses list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length === 0 ? (
          <p className="text-gray-500">
            No courses yet, Create your first course!
          </p>
        ) : (
          courses.map((course) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className="border border-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="font-bold text-lg mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm">{course.description}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
