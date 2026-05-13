import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import BackendLayout from '@/Layouts/BackendLayout';

export default function AbstractBooks({ conference, abstractBooks }) {
    const { data, setData, post, reset, processing, errors } = useForm({
        year: new Date().getFullYear(),
        version: '',
        pdf_link: null,
        cover_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/conference/${conference.id}/abstract-books`, {
            onSuccess: () => reset(),
            forceFormData: true,
        });
    };

    return (
        <BackendLayout title={`Abstract Books - ${conference.conference_title}`}>
            <Head title="Manage Abstract Books" />
            
            <div className="mb-10 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900">Abstract Books</h1>
                <p className="text-slate-500">{conference.conference_title}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Year / Version</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {abstractBooks.map(book => (
                                    <tr key={book.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{book.year}</div>
                                            <div className="text-sm text-gray-500">{book.version}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-4 font-bold text-sm">
                                                <Link href={`/editor/conference/abstract-book/${book.id}/articles`} className="text-green-600 hover:underline">Manage Articles</Link>
                                                <Link href={`/editor/conference/abstract-book/${book.id}`} method="delete" as="button" className="text-red-600 hover:underline">Delete</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-fit">
                    <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">Add New Abstract Book</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                            <input type="number" className="w-full border border-slate-200 rounded-lg p-2" value={data.year} onChange={e => setData('year', e.target.value)} required />
                            {errors.year && <div className="text-red-500 text-xs mt-1">{errors.year}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Version/Title</label>
                            <input className="w-full border border-slate-200 rounded-lg p-2" value={data.version} onChange={e => setData('version', e.target.value)} required placeholder="e.g. Volume 1" />
                            {errors.version && <div className="text-red-500 text-xs mt-1">{errors.version}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Abstract Book PDF</label>
                            <input type="file" className="w-full text-sm" onChange={e => setData('pdf_link', e.target.files[0])} required />
                            {errors.pdf_link && <div className="text-red-500 text-xs mt-1">{errors.pdf_link}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image (Optional)</label>
                            <input type="file" className="w-full text-sm" onChange={e => setData('cover_image', e.target.files[0])} />
                            {errors.cover_image && <div className="text-red-500 text-xs mt-1">{errors.cover_image}</div>}
                        </div>
                        <button type="submit" disabled={processing} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                            Create Abstract Book
                        </button>
                    </form>
                </div>
            </div>
        </BackendLayout>
    );
}
