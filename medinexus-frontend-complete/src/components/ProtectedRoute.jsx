import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API_URL } from "../services/api";

export default function ProtectedRoute({ children }) {

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {

    fetch(`${API_URL}/auth/me`, {
      credentials: "include",
    })
      .then((response) => {

        if (response.ok) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }

      })
      .catch(() => {
        setLoggedIn(false);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }


  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }


  return children;
}