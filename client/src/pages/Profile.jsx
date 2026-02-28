import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [username, setUsername] = useState(user?.username || "");

  const handleUpdate = (e) => {
    e.preventDefault();
    // TODO : Implement update user API
    toast.success("Profile updated successfully! (API isn't implemented yet");
    setEditing(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1">
                Full Name
              </label>
              <p className="text-lg font-semibold">{user?.fullname}</p>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">
                Username
              </label>
              <p className="text-lg font-semibold">{user?.username}</p>
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Email</label>
              <p className="text-lg font-semibold">{user?.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* change password section */}

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Change Password
        </button>
        <p className="text-sm text-gray-500 mt-2">(Feature coming soon)</p>
      </div>
    </div>
  );
};

export default Profile;
