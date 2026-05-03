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
                    
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center border-b pb-4">Available Departments</h2>
                        <div className="grid gap-6">
                            {departments.map(dept => (
                                <div key={dept.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <h3 className="text-xl font-bold text-[#1f3a5f]">{dept.name}</h3>
                                        <Link
                                            href={`/department?id=${dept.id}&type=${type}`}
                                            className="px-4 py-2 bg-[#1f3a5f] text-white rounded text-sm font-bold hover:bg-blue-800 transition text-center whitespace-nowrap"
                                        >
                                            Select Department &rarr;
                                        </Link>
                                    </div>

                                    {type === 'journal' && dept.journals && dept.journals.length > 0 && (
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {dept.journals.map(journal => (
                                                <Link
                                                    key={journal.id}
                                                    href={`/department?id=${dept.id}&type=journal&journal_id=${journal.id}`}
                                                    className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-center min-h-[100px]"
                                                >
                                                    <h4 className="font-bold text-[#1f3a5f] group-hover:text-blue-700 line-clamp-2 text-sm text-center">{journal.journal_title}</h4>
                                                    <div className="mt-2 flex items-center justify-center">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                            journal.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {journal.status}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

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
