"use client";

import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleLoginSuccess = (status: boolean) => {
    if (status) {
      router.push("/inventory");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r bg-mint-green flex flex-col items-center justify-center">
      {/* Header Section */}
      <Header></Header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-8 py-12">
        <div className="bg-white shadow-2xl rounded-lg p-5 transform transition duration-500 hover:scale-105 w-full max-w-sm">
          <h2 className="text-dark- font-bold text-3xl mb-6 text-center">
            Login
          </h2>
          <LoginForm onLoginSuccess={handleLoginSuccess}></LoginForm>
        </div>
      </main>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
};

export default LoginPage;
