import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ForgotPassword() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <Head title="Forgot Password" />
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Forgot Your Password?</h2>
                <p className="text-gray-600 mb-8">
                    Please contact the system administrator to reset your password.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8">
                    <p className="text-sm text-blue-800">
                        <strong>Admin Contact:</strong> admin@example.com
                    </p>
                </div>

                <Link href="/backend-login" className="text-blue-600 hover:underline font-medium">
                    &larr; Back to Login
                </Link>
            </div>
        </div>
    );
}
