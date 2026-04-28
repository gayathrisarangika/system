import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ContactUs({ journal }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={`Contact Us - ${journal.journal_title}`} />

            {/* Header */}
            <header className="bg-white border-b py-8 shadow-sm">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 leading-tight">{journal.journal_title}</h1>
                        <p className="text-lg text-gray-600 mt-2 uppercase tracking-widest font-medium">{journal.university_name}</p>
                    </div>
                    {journal.university_logo && (
                        <div className="flex-shrink-0">
                            <img src={journal.university_logo} alt="University Logo" className="h-20 object-contain" />
                        </div>
                    )}
                </div>
            </header>

            {/* Navigation Bar */}
            <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center md:justify-start">
                        <Link href={`/journal/${journal.id}`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Home</Link>
                        <Link href={`/journal/${journal.id}/editorial-board`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Editorial</Link>
                        <Link href={`/journal/${journal.id}/current`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Current</Link>
                        <Link href={`/journal/${journal.id}/archive`} className="px-6 py-4 hover:bg-blue-800 transition font-medium">Archive</Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-10 flex-1">
                <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-blue-900">Contact Us</h2>

                    <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                        {journal.contact_us || "No contact information available."}
                    </div>

                    <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
                        <h3 className="text-xl font-bold text-blue-900 mb-4 font-serif">Inquiries</h3>
                        <p className="text-gray-700">
                            For any inquiries regarding the journal, please reach out using the contact details provided above.
                            Our editorial team will get back to you as soon as possible.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12 mt-auto">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-gray-700 pb-8 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold">{journal.journal_title}</h2>
                            <p className="text-gray-400 mt-1">{journal.university_name}</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-gray-400">Powered by Publication Management System</p>
                            <p className="text-gray-400 text-sm mt-1">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
