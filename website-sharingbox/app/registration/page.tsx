"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Footer from '../components/Footer';

const RegistrationPage: React.FC = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);
    const [userId, setUserId] = useState(null);

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
                setUserId(result.user_id);
                setIsAwaitingConfirmation(true);

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

    const handleTokenConfirmation = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!token) {
            setError('Please enter the confirmation token');
            return;
        }

        const confirmationData = {
            user_id: userId,
            token: token
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/auth/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(confirmationData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
                setError('An account with this phone number already exists. Redirecting to login...');
                router.push('/login');
            } else {
                const result = await response.json();
                setError(result.message || 'Account confirmation failed');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred during account confirmation');
        }
    };

    return (
        <div className="min-h-screen bg-mint-green flex flex-col items-center justify-center">
            {/* Header Section */}
            <header className="w-full bg-mint-green text-dark-green shadow-lg">
                <div className="container mx-auto px-10 py-16">
                    <h1 className="text-5xl font-extrabold text-center">Your Smart Giveaway Box</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-8 py-12">
                <div className="bg-white shadow-2xl rounded-lg p-12 transform transition duration-500 hover:scale-105 text-center w-full max-w-sm">
                    {isAwaitingConfirmation ? (
                        <>
                            <h2 className="text-gray-800 font-bold text-3xl mb-6">Confirm Your Account</h2>
                            <form onSubmit={handleTokenConfirmation}>
                                <div className="mb-6">
                                    <label htmlFor="token" className="block text-gray-700 font-medium mb-3 text-lg">
                                        Please enter the code sent to you via SMS.
                                    </label>
                                    <input
                                        type="text"
                                        id="token"
                                        name="token"
                                        className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
                                        placeholder="Enter the code"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-500 text-lg mb-4">{error}</p>}
                                <button
                                    type="submit"
                                    className="w-full bg-dark-green text-white py-3 px-6 rounded-lg text-lg hover:bg-dark-green-hover focus:outline-none focus:ring-2 focus:ring-dark-green"
                                >
                                    Confirm
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
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
                                        className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
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
                                        className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
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
                                        className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
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
                                        className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
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
                                        className="w-full px-6 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
                                        placeholder="Repeat your password"
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && <p className="text-red-500 text-lg mb-4">{error}</p>}

                                <button
                                    type="submit"
                                    className="w-full bg-dark-green text-white py-3 px-6 rounded-lg text-lg hover:bg-dark-green-hover focus:outline-none focus:ring-2 focus:ring-dark-green"
                                >
                                    Register
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </main>

            {/* Footer */}
            <Footer></Footer>
        </div>
    );
};

export default RegistrationPage;
