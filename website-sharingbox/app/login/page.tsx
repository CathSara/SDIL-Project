"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);

                router.push('/inventory');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center">
            {/* Header Section */}
            <header className="w-full bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto px-10 py-16">
                    <h1 className="text-5xl font-extrabold text-center">Sharing Box Köln!</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-8 py-12">
                <div className="bg-white shadow-2xl rounded-lg p-12 transform transition duration-500 hover:scale-105 text-center w-full max-w-sm">
                    <h2 className="text-gray-800 font-bold text-3xl mb-6">Login</h2>
                    {errorMessage && (
                        <p className="text-red-500 mb-4 text-lg">{errorMessage}</p>
                    )}
                    <form onSubmit={handleLogin}>
                        <div className="mb-6">
                            <label htmlFor="phone_number" className="block text-gray-700 font-medium mb-3 text-lg">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phone_number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-3 text-lg">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
