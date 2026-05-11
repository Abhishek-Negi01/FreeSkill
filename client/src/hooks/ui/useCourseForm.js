import { useState } from "react";

const useCourseForm = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Start editing a course
  const startEdit = (course) => {
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseDescription(course.description);
    setShowForm(true);
  };

  // Cancel form and reset
  const cancelForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setCourseTitle("");
    setCourseDescription("");
  };

  // Reset form after successful submission
  const resetForm = () => {
    setCourseTitle("");
    setCourseDescription("");
    setShowForm(false);
    setEditingCourse(null);
  };

  // Toggle form visibility
  const toggleForm = () => {
    if (showForm) {
      cancelForm();
    } else {
      setShowForm(true);
    }
  };

  // Get form data
  const getFormData = () => ({
    title: courseTitle,
    description: courseDescription,
  });

  // Check if form is valid
  const isFormValid = () => {
    return courseTitle.trim() && courseDescription.trim();
  };

  return {
    // Form state
    courseTitle,
    setCourseTitle,
    courseDescription,
    setCourseDescription,
    showForm,
    setShowForm,
    editingCourse,
    setEditingCourse,

    // Actions
    startEdit,
    cancelForm,
    resetForm,
    toggleForm,

    // Utils
    getFormData,
    isFormValid,
    isEditing: !!editingCourse,
  };
};

export default useCourseForm;
