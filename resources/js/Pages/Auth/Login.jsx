import React from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function Login({ dept_id, type }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        dept_id: dept_id || '',
        type: type || 'journal',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Head title="Login" />
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                
                {errors.username && <div className="text-red-500 mb-4 text-sm">{errors.username}</div>}

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
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                        disabled={processing}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
