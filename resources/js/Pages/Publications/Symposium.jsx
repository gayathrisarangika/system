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
            </header>

            <nav className="bg-blue-900 text-white flex justify-center gap-8 py-3 sticky top-0 z-10 shadow-md">
                <Link href={`/symposium/${symposium.id}`} className="hover:text-blue-200 font-medium">Home</Link>
                <a href="#committee" className="hover:text-blue-200 font-medium">Committee</a>
                <a href="#proceedings" className="hover:text-blue-200 font-medium">Proceedings</a>
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
                    <div className="mt-20" id="proceedings">
                        <h3 className="text-2xl font-bold text-blue-900 mb-8">Recent Proceedings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {symposium.proceedings.map(p => (
                                <div key={p.id} className="flex bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                                    <div className="w-full p-4 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900">{p.version}</h4>
                                            <p className="text-gray-600">{p.year}</p>
                                        </div>
                                    </div>
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
