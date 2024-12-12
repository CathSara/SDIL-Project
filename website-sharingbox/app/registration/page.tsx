"use client";

import React, { useState } from 'react';

const RegistrationPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Check if the passwords match
        if (password !== repeatPassword) {
            setError('Passwords do not match');
            return;
        }

        // Submit the form if passwords match
        setError('');
        console.log('Form submitted');
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
                    <h2 className="text-gray-800 font-bold text-3xl mb-6">Registration</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="firstname" className="block text-gray-700 font-medium mb-3 text-lg">
                                Firstname
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter your firstname"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="lastname" className="block text-gray-700 font-medium mb-3 text-lg">
                                Lastname
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter your lastname"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-3 text-lg">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter your email address"
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
                                name="password"
                                className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="repeatPassword" className="block text-gray-700 font-medium mb-3 text-lg">
                                Repeat Password
                            </label>
                            <input
                                type="password"
                                id="repeatPassword"
                                name="repeatPassword"
                                className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Repeat your password"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Error message for password mismatch */}
                        {error && <p className="text-red-500 text-lg mb-4">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default RegistrationPage;
