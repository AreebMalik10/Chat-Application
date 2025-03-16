import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import { fetchUsers } from "../Api";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;
  console.log("User Data in Home Page:", userData);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchUsers(search);
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (search.length > 0) fetchUser();
  }, [search]);

  const handleChatStart = (selectedUser) => {
    console.log("Navigating to chat with user:", selectedUser);
    console.log("Current user data:", userData);
    navigate(`/chat`, { 
      state: { selectedUser, userData }
    });
  };

  return (
    <>
      <Navbar userData={userData} />
      <div>
        <h2>Search for a User</h2>
        <input
          type="text"
          placeholder="Search username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul>
          {users?.map((user) => (
            <li key={user._id}>
              <button onClick={() => handleChatStart(user)}>
                Chat with {user.username}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
