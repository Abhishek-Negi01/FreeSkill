import { useState } from "react";

const useQuestionEdit = () => {
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [editQuestionTitle, setEditQuestionTitle] = useState("");
  const [editQuestionBody, setEditQuestionBody] = useState("");

  const startEdit = (question) => {
    setEditingQuestion(true);
    setEditQuestionTitle(question.title);
    setEditQuestionBody(question.body);
  };

  const cancelEdit = () => {
    setEditingQuestion(false);
    setEditQuestionTitle("");
    setEditQuestionBody("");
  };

  const getEditData = () => ({
    title: editQuestionTitle,
    body: editQuestionBody,
  });

  const isValid = () => {
    return editQuestionTitle.trim() && editQuestionBody.trim();
  };

  return {
    editingQuestion,
    editQuestionTitle,
    editQuestionBody,
    setEditQuestionTitle,
    setEditQuestionBody,
    startEdit,
    cancelEdit,
    getEditData,
    isValid,
  };
};

export default useQuestionEdit;
