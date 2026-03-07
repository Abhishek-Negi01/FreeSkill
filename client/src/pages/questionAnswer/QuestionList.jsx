import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { questionService } from "../../api/services/questions";
import { Link } from "react-router-dom";
import { FaCalendar, FaThumbsDown, FaThumbsUp, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(AuthContext);

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.body.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const fetchQuestions = async () => {
    try {
      const response = await questionService.getAll();
      setQuestions(response.data.data.questions);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load questions");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Community Questions</h1>
        {user && (
          <Link
            to="/ask"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ask Question
          </Link>
        )}
      </div>

      {questions.length > 0 && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 "
          />
        </div>
      )}

      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <p className="text-gray-500">
            {searchQuery
              ? "No questions found matching your search"
              : "No questions yet. Be the first to ask!"}
          </p>
        ) : (
          filteredQuestions.map((question) => (
            <Link
              key={question._id}
              to={`/questions/${question._id}`}
              className="block border border-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition bg-white"
            >
              <h3 className="font-bold text-lg mb-2">{question.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {question.body}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FaUser />
                  {question.askedBy?.fullname || question.askedBy?.username}
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <FaThumbsUp className="text-green-600" />
                    {question.upvotes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaThumbsDown className="text-red-600" />
                    {question.downvotes?.length || 0}
                  </span>
                </span>

                <span className="flex items-center gap-1">
                  <FaCalendar />
                  {new Date(question.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionList;
