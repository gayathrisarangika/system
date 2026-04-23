import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Symposium({ symposium }) {
    return (
        <div className="min-h-screen bg-white">
            <Head title={symposium.symposium_title} />

            <header className="bg-gray-100 py-10 px-6 flex justify-between items-center border-b">
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-gray-900">{symposium.symposium_title}</h1>
                    <h3 className="text-xl text-blue-900 mt-2">{symposium.university_name}</h3>
                </div>
                {symposium.university_logo && (
                    <div className="hidden md:block">
                        <img src={symposium.university_logo} alt="Logo" className="max-h-32" />
                    </div>
                )}
            </header>

            <nav className="bg-blue-900 text-white flex justify-center gap-8 py-3 sticky top-0 z-10 shadow-md">
                <Link href={`/symposium/${symposium.id}`} className="hover:text-blue-200 font-medium">Home</Link>
                <Link href="#" className="hover:text-blue-200 font-medium">Committee</Link>
                <Link href="#" className="hover:text-blue-200 font-medium">Proceedings</Link>
            </nav>

            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-900 pb-2 inline-block">About the Symposium</h2>
                        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {symposium.symposium_details}
                        </div>
                    </div>

                    <div className="lg:w-1/3 flex flex-col gap-8">
                        {symposium.cover_image && (
                            <img src={symposium.cover_image} alt="Symposium Cover" className="w-full rounded-lg shadow-2xl" />
                        )}

                        <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-900 shadow-sm">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Aim & Scope</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{symposium.aim_scope}</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-900 shadow-sm">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Mission</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{symposium.mission}</p>
                        </div>
                    </div>
                </div>

                {symposium.proceedings && symposium.proceedings.length > 0 && (
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold text-blue-900 mb-8">Recent Proceedings</h3>
                        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                            {symposium.proceedings.map(p => (
                                <div key={p.id} className="flex-shrink-0 group">
                                    <img
                                        src={p.cover_image}
                                        alt={p.version}
                                        className="w-48 h-64 object-cover rounded shadow-md group-hover:scale-105 transition duration-300"
                                    />
                                    <p className="mt-2 text-center text-sm font-medium text-gray-600">{p.version} ({p.year})</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-gray-100 py-12 mt-20 border-t">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{symposium.symposium_title}</h2>
                    <p className="mt-4 text-gray-500">&copy; {new Date().getFullYear()} {symposium.university_name}</p>
                </div>
            </footer>
        </div>
    );
}
