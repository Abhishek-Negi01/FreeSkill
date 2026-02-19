import React, { useEffect, useState } from "react";
import { courseService } from "../../api/services/courses.js";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);

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
    <div className="grid grid-cols-3 gap-4 p-4">
      {courses.length === 0 ? (
        <p>No course yet. Create your first course! </p>
      ) : (
        courses.map((course) => (
          <div key={course._id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg">{course.title}</h3>
            <p className="text-gray-600 text-sm">{course.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
