"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../components/Footer';
import Header from '../components/Header';

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

                // Store the token in localStorage (if needed for API requests)
                localStorage.setItem('token', data.token);

                // Store the user ID as a session cookie
                document.cookie = `user_id=${data.user_id}; path=/;`;

                // Redirect to inventory page
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
        <div className="min-h-screen bg-gradient-to-r bg-mint-green flex flex-col items-center justify-center">
            {/* Header Section */}
            <Header></Header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-8 py-12">
                <div className="bg-white shadow-2xl rounded-lg p-5 transform transition duration-500 hover:scale-105 w-full max-w-sm">
                    <h2 className="text-dark- font-bold text-3xl mb-6 text-center">Login</h2>
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
                                className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green
                                "
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
                        <a className='flex justify-center' href="/registration">
                            <span className='mr-1'>New member?</span>
                            <u>Start here.</u>
                        </a>
                    </form>
                </div>
            </main>
            
            {/* Footer */}
            <Footer></Footer>
        </div>
    );
};

export default LoginPage;
