"use client";

import React, { useState } from "react";

interface LoginFormProps {
  onLoginSuccess: (status: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the token in localStorage (if needed for API requests)
        localStorage.setItem("token", data.token);

        // Store the user ID as a session cookie
        document.cookie = `user_id=${data.user_id}; path=/;`;

        onLoginSuccess(true);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {errorMessage && (
        <p className="text-red-500 mb-4 text-lg">{errorMessage}</p>
      )}
      <form onSubmit={handleLogin}>
        <div className="mb-6">
          <label
            htmlFor="phone_number"
            className="block text-gray-700 font-medium mb-3 text-lg"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phone_number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green
                                "
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-3 text-lg"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-dark-green text-white py-3 px-6 rounded-lg text-lg hover:bg-dark-green-hover focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
        >
          Sign In
        </button>
        <a className="flex justify-center" href="/registration">
          <span className="mr-1">New member?</span>
          <u>Start here.</u>
        </a>
      </form>
    </div>
  );
};

export default LoginForm;
