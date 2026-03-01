import React, { useEffect, useState } from "react";
import { courseService } from "../../api/services/courses.js";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const createCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await courseService.create({
        title: courseTitle,

        description: courseDescription,
      });

      setCourses([...courses, res.data.data.course]);
      setCourseTitle("");
      setCourseDescription("");
      setShowForm(false);
      toast.success(res?.data?.message || "Course created successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await courseService.update(
        editingCourse._id,

        { title: courseTitle, description: courseDescription },
      );

      setCourses(
        courses.map((c) =>
          c._id === editingCourse._id ? res.data.data.course : c,
        ),
      );
      setCourseTitle("");
      setCourseDescription("");
      setEditingCourse(null);
      setShowForm(false);
      toast.success(res?.data?.message || "Course updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!confirm("Delete this course? All videos will be lost.")) {
      return;
    }
    try {
      const res = await courseService.delete(courseId);
      setCourses(courses.filter((c) => c._id !== courseId));
      toast.success(res?.data?.message || "Course deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete course");
    }
  };

  const startEdit = (course, e) => {
    e.preventDefault();
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseDescription(course.description);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setCourseTitle("");
    setCourseDescription("");
  };

  useEffect(() => {
    courseService
      .getAll()
      .then((res) => {
        // console.log("Full response : ", res.data);
        setCourses(res.data.data.courses);
      })
      .catch((err) => {
        toast.error("Failed to load courses");
        console.log(err);
      });
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Create Course"}
        </button>
      </div>

      {!showForm && courses.length > 0 && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search courses"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 "
          />
        </div>
      )}

      {/* Create/Edit course form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingCourse ? "Edit Course" : "Create New Course"}
          </h2>

          <form onSubmit={editingCourse ? updateCourse : createCourse}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading
                  ? "Saving..."
                  : editingCourse
                    ? "Update Course"
                    : "Create Course"}
              </button>
              {editingCourse && (
                <button
                  type="button"
                  onClick={cancelForm}
                  disabled={loading}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* all courses list considering flitered courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length === 0 ? (
          <p className="text-gray-500">
            {searchQuery
              ? "No courses found matching your search"
              : "No courses yet, Create your first course!"}
          </p>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course._id}
              className="border border-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <Link to={`/courses/${course._id}`}>
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {course.description}
                </p>
              </Link>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => startEdit(course, e)}
                  className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCourse(course._id)}
                  className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
