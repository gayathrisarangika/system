import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function AbstractBooks({ symposium, abstractBooks }) {
    const { data, setData, post, reset, processing, errors } = useForm({
        year: new Date().getFullYear(),
        version: '',
        pdf_link: null,
        cover_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/symposium/${symposium.id}/abstract-books`, {
            onSuccess: () => reset(),
            forceFormData: true,
        });
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <Head title="Manage Abstract Books" />
            
            <div className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 font-serif">Abstract Books</h1>
                <p className="text-gray-500">{symposium.symposium_title}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                                                <Link href={`/editor/symposium/abstract-book/${book.id}/articles`} className="text-green-600 hover:underline">Manage Articles</Link>
                                                <Link href={`/editor/symposium/abstract-book/${book.id}`} method="delete" as="button" className="text-red-600 hover:underline">Delete</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Add New Abstract Book</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input type="number" className="w-full border rounded-lg p-2" value={data.year} onChange={e => setData('year', e.target.value)} required />
                            {errors.year && <div className="text-red-500 text-xs mt-1">{errors.year}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Version/Title</label>
                            <input className="w-full border rounded-lg p-2" value={data.version} onChange={e => setData('version', e.target.value)} required placeholder="e.g. Volume 1" />
                            {errors.version && <div className="text-red-500 text-xs mt-1">{errors.version}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Abstract Book PDF</label>
                            <input type="file" className="w-full text-sm" onChange={e => setData('pdf_link', e.target.files[0])} required />
                            {errors.pdf_link && <div className="text-red-500 text-xs mt-1">{errors.pdf_link}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image (Optional)</label>
                            <input type="file" className="w-full text-sm" onChange={e => setData('cover_image', e.target.files[0])} />
                            {errors.cover_image && <div className="text-red-500 text-xs mt-1">{errors.cover_image}</div>}
                        </div>
                        <button type="submit" disabled={processing} className="w-full bg-[#1f3a5f] text-white py-2 rounded-lg font-bold hover:bg-blue-800 transition">
                            Create Abstract Book
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
