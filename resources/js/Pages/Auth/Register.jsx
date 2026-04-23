import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';

export default function Register({ dept_id, type }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        dept_id: dept_id || '',
        type: type || 'journal',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Head title="Register Editor" />
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register as Editor</h2>

                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.username}
                            onChange={e => setData('username', e.target.value)}
                            required
                        />
                        {errors.username && <div className="text-red-500 text-xs mt-1">{errors.username}</div>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                        disabled={processing}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
