import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function DepartmentSelection({ departments, journals, type }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={`Select ${type === 'journal' ? 'Journal' : 'Department'}`} />
            
            <header className="bg-[#1f3a5f] text-white text-center py-8 px-4 shadow-md">
                <h1 className="text-3xl font-bold uppercase tracking-wide">
                    {type === 'journal' ? 'Select Journal' : 'Select Department'}
                </h1>
                <p className="mt-2 opacity-90 text-sm italic">For {type.charAt(0).toUpperCase() + type.slice(1)} Management</p>
            </header>

            <main className="flex-grow flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-4xl">
                    
                    {type === 'journal' ? (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-4">Available Journals</h2>
                            {journals.length > 0 ? (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {journals.map(journal => (
                                        <Link 
                                            key={journal.id}
                                            href={`/department?id=${journal.department_id}&type=journal&journal_id=${journal.id}`}
                                            className="flex flex-col h-full bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                                        >
                                            <div className="aspect-[3/4] bg-gray-50 rounded-t-xl overflow-hidden border-b">
                                                {journal.cover_image ? (
                                                    <img src={journal.cover_image} alt={journal.journal_title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 p-4 text-center text-xs italic">
                                                        {journal.journal_title}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex-grow flex flex-col justify-between">
                                                <h3 className="font-bold text-[#1f3a5f] group-hover:text-blue-700 line-clamp-2 text-sm">{journal.journal_title}</h3>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{journal.university_name}</p>
                                                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                        journal.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {journal.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 italic py-10">No journals found in the database.</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center border-b pb-4">Available Departments</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {departments.map(dept => (
                                    <Link 
                                        key={dept.id}
                                        href={`/department?id=${dept.id}&type=${type}`}
                                        className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-[#1f3a5f] font-semibold hover:bg-[#1f3a5f] hover:text-white transition shadow-sm flex items-center justify-center text-center"
                                    >
                                        {dept.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-12 text-center border-t pt-6">
                        <Link href="/backend-login" className="text-gray-500 hover:text-blue-900 flex items-center justify-center gap-2 font-medium">
                            <span>&larr;</span> Back to Type Selection
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="bg-[#1f3a5f] text-white text-center py-6 text-sm mt-auto">
                <p>&copy; {new Date().getFullYear()} Faculty of Social Sciences and Languages</p>
            </footer>
        </div>
    );
}
