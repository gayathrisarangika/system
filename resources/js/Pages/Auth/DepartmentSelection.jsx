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
