import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sent, setSent] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);

//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/users/forgot-password`,
//         {
//           email,
//         },
//       );
//       setSent(true);
//       toast.success("Password reset email sent!");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to send email");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (sent) {
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center p-4"
//         style={{
//           background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
//         }}
//       >
//         <div className="card p-8 w-full max-w-md text-center animate-scaleIn">
//           <div
//             className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
//             style={{
//               background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
//             }}
//           >
//             <FaEnvelope className="w-10 h-10" style={{ color: "#10b981" }} />
//           </div>
//           <h2
//             className="text-2xl md:text-3xl font-bold mb-4"
//             style={{ color: "#1f2937" }}
//           >
//             Check Your Email
//           </h2>
//           <p className="text-sm md:text-base mb-6" style={{ color: "#6b7280" }}>
//             We've sent a password reset link to{" "}
//             <span className="font-semibold" style={{ color: "#3b82f6" }}>
//               {email}
//             </span>
//           </p>
//           <Link to="/login" className="btn btn-primary w-full">
//             <FaArrowLeft /> Back to Login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4"
//       style={{
//         background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
//       }}
//     >
//       <div className="card p-6 md:p-8 w-full max-w-md animate-fadeIn">
//         <h2
//           className="text-2xl md:text-3xl font-bold text-center mb-2 gradient-text"
//           style={{
//             background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}
//         >
//           Forgot Password
//         </h2>
//         <p className="text-center mb-6 text-sm" style={{ color: "#6b7280" }}>
//           Enter your email to receive a password reset link
//         </p>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-6">
//             <label
//               className="block font-semibold mb-2 text-sm"
//               style={{ color: "#374151" }}
//             >
//               Email
//             </label>
//             <div className="relative">
//               <FaEnvelope
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2"
//                 style={{ color: "#9ca3af" }}
//               />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="input pl-10"
//                 placeholder="your@email.com"
//                 required
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full btn btn-primary mb-4"
//           >
//             {loading ? (
//               <>
//                 <div
//                   className="spinner"
//                   style={{ width: "20px", height: "20px", borderWidth: "2px" }}
//                 ></div>
//                 Sending...
//               </>
//             ) : (
//               "Send Reset Link"
//             )}
//           </button>

//           <Link
//             to="/login"
//             className="flex items-center justify-center gap-2 text-sm font-medium hover:underline transition"
//             style={{ color: "#3b82f6" }}
//           >
//             <FaArrowLeft /> Back to Login
//           </Link>
//         </form>
//       </div>
//     </div>
//   );
// };

const ForgotPassword = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center animate-fadeIn">
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          }}
        >
          <FaEnvelope className="w-10 h-10" style={{ color: "#f59e0b" }} />
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: "#1f2937" }}>
          Password Reset Unavailable
        </h2>
        <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
          Password reset via email is currently unavailable. This feature will
          be available soon.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white w-full shadow"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          }}
        >
          <FaArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
