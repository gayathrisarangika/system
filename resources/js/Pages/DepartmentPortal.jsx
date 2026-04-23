import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function DepartmentPortal({ department, type }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Department Portal" />
            <header className="bg-blue-900 text-white py-6 px-4 shadow-lg text-center">
                <h1 className="text-3xl font-bold">Department Portal</h1>
                <p className="mt-2 text-blue-200">{department.name}</p>
            </header>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Login Card */}
                    <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-blue-600">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
                        <p className="text-gray-600 mb-8">Access your dashboard to manage publications.</p>
                        <Link
                            href={`/login?id=${department.id}&type=${type}`}
                            className="inline-block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Go to Login
                        </Link>
                    </div>

                    {/* Register Card */}
                    <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-green-600">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Register as Editor</h2>
                        <p className="text-gray-600 mb-8">Join our team of editors for this department.</p>
                        <Link
                            href={`/register?id=${department.id}&type=${type}`}
                            className="inline-block w-full text-center bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                        >
                            Register Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
