import { useState } from "react";

const useAnswerEdit = () => {
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerBody, setEditAnswerBody] = useState("");

  const startEdit = (answer) => {
    setEditingAnswerId(answer._id);
    setEditAnswerBody(answer.body);
  };

  const cancelEdit = () => {
    setEditingAnswerId(null);
    setEditAnswerBody("");
  };

  const isEditing = (answerId) => editingAnswerId === answerId;

  const isValid = () => editAnswerBody.trim();

  return {
    editingAnswerId,
    editAnswerBody,
    setEditAnswerBody,
    startEdit,
    cancelEdit,
    isEditing,
    isValid,
  };
};

export default useAnswerEdit;
