import { useState, useCallback } from "react";

const useQuestionForm = (initialTitle = "", initialBody = "") => {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation rules
  const validateTitle = useCallback((titleValue) => {
    if (!titleValue.trim()) {
      return "Title is required";
    }
    if (titleValue.trim().length < 10) {
      return "Title must be at least 10 characters";
    }
    if (titleValue.trim().length > 200) {
      return "Title must be less than 200 characters";
    }
    return null;
  }, []);

  const validateBody = useCallback((bodyValue) => {
    if (!bodyValue.trim()) {
      return "Question body is required";
    }
    if (bodyValue.trim().length < 20) {
      return "Question body must be at least 20 characters";
    }
    if (bodyValue.trim().length > 5000) {
      return "Question body must be less than 5000 characters";
    }
    return null;
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    const titleError = validateTitle(title);
    if (titleError) newErrors.title = titleError;

    const bodyError = validateBody(body);
    if (bodyError) newErrors.body = bodyError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, body, validateTitle, validateBody]);

  // Handle title change with validation
  const handleTitleChange = useCallback(
    (value) => {
      setTitle(value);
      // Clear title error if it exists
      if (errors.title) {
        setErrors((prev) => ({ ...prev, title: null }));
      }
    },
    [errors.title],
  );

  // Handle body change with validation
  const handleBodyChange = useCallback(
    (value) => {
      setBody(value);
      // Clear body error if it exists
      if (errors.body) {
        setErrors((prev) => ({ ...prev, body: null }));
      }
    },
    [errors.body],
  );

  // Reset form
  const resetForm = useCallback(() => {
    setTitle("");
    setBody("");
    setErrors({});
    setLoading(false);
  }, []);

  // Get form data
  const getFormData = useCallback(
    () => ({
      title: title.trim(),
      body: body.trim(),
    }),
    [title, body],
  );

  // Check if form is valid
  const isFormValid = useCallback(() => {
    return title.trim() && body.trim() && Object.keys(errors).length === 0;
  }, [title, body, errors]);

  // Check if form has changes
  const hasChanges = useCallback(() => {
    return title.trim() !== initialTitle || body.trim() !== initialBody;
  }, [title, body, initialTitle, initialBody]);

  // Get character counts
  const titleLength = title.length;
  const bodyLength = body.length;
  const titleRemaining = 200 - titleLength;
  const bodyRemaining = 5000 - bodyLength;

  return {
    // Form state
    title,
    body,
    loading,
    errors,

    // Actions
    setTitle: handleTitleChange,
    setBody: handleBodyChange,
    setLoading,
    resetForm,
    validateForm,

    // Utils
    getFormData,
    isFormValid,
    hasChanges,

    // Validation helpers
    titleLength,
    bodyLength,
    titleRemaining,
    bodyRemaining,
    isTitleValid: !errors.title && titleLength >= 10,
    isBodyValid: !errors.body && bodyLength >= 20,
  };
};

export default useQuestionForm;
