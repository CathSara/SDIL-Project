"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const RegistrationPage: React.FC = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== repeatPassword) {
        setError('Passwords do not match');
        return;
    }

    const userData = {
        phone_number: phoneNumber,
        first_name: firstName,
        last_name: lastName,
        password: password
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            alert('Registration successful! Redirecting to login page...');
            router.push('/login')
        } else if (response.status === 409) {
            setError('An account with this phone number already exists. Redirecting to login...');
            setTimeout(() => {
                router.push('/login')
            }, 3000);
        } else {
            const result = await response.json();
            setError(result.message || 'Registration failed');
        }
    } catch (error) {
        console.error(error);
        setError('An error occurred during registration');
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
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
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
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="phone_number" className="block text-gray-700 font-medium mb-3 text-lg">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter your phone number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
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
