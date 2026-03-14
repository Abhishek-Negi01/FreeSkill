import React from "react";
import {
  FaUser,
  FaCalendar,
  FaThumbsUp,
  FaThumbsDown,
  FaCheckCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const AnswerCard = ({
  answer,
  isAccepted,
  currentUserId,
  questionOwnerId,
  onUpvote,
  onDownvote,
  onAccept,
  onEdit,
  onDelete,
}) => {
  const isOwner = currentUserId === answer.answeredBy?._id;
  const isQuestionOwner = currentUserId === questionOwnerId;

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-5 md:p-6 animate-fadeIn transition-all duration-300 hover:shadow-xl"
      style={{
        border: isAccepted ? "2px solid #10b981" : "1px solid #e5e7eb",
        background: isAccepted
          ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
          : "white",
      }}
    >
      {isAccepted && (
        <div
          className="flex items-center gap-2 mb-4 text-sm md:text-base font-bold animate-slideDown"
          style={{ color: "#10b981" }}
        >
          <FaCheckCircle className="w-5 h-5" />
          Accepted Answer
        </div>
      )}

      <p
        className="text-sm md:text-base lg:text-lg mb-6 whitespace-pre-wrap leading-relaxed"
        style={{ color: "#374151" }}
      >
        {answer.body}
      </p>

      <div
        className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm mb-4"
        style={{ color: "#6b7280" }}
      >
        <span className="flex items-center gap-1.5">
          <FaUser />
          <span className="font-medium">
            {answer.answeredBy?.fullname || answer.answeredBy?.username}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <FaCalendar />
          {new Date(answer.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t"
        style={{ borderColor: "#e5e7eb" }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onUpvote(answer._id)}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-2 rounded-lg font-semibold transition-all hover:scale-105"
            style={{
              borderColor: "#d1fae5",
              background: "#f0fdf4",
            }}
          >
            <FaThumbsUp style={{ color: "#10b981" }} />
            <span className="text-sm" style={{ color: "#065f46" }}>
              {answer.upvotes?.length || 0}
            </span>
          </button>
          <button
            onClick={() => onDownvote(answer._id)}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-2 rounded-lg font-semibold transition-all hover:scale-105"
            style={{
              borderColor: "#fecaca",
              background: "#fef2f2",
            }}
          >
            <FaThumbsDown style={{ color: "#ef4444" }} />
            <span className="text-sm" style={{ color: "#991b1b" }}>
              {answer.downvotes?.length || 0}
            </span>
          </button>

          {isQuestionOwner && !isAccepted && (
            <button
              onClick={() => onAccept(answer._id)}
              className="btn btn-accent text-xs md:text-sm"
            >
              <FaCheckCircle /> Accept
            </button>
          )}
        </div>

        {isOwner && (
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(answer)}
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:underline"
              style={{ color: "#3b82f6" }}
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => onDelete(answer._id)}
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:underline"
              style={{ color: "#ef4444" }}
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerCard;
