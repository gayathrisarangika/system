import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Articles({ abstractBook, articles }) {
    const [editingArticle, setEditingArticle] = useState(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        title: '',
        author: '',
        abstract: '',
        keywords: '',
        year: abstractBook.year,
        pdf: null,
    });

    const { data: editData, setData: setEditData, post: postEdit, errors: editErrors, reset: resetEdit } = useForm({
        title: '',
        author: '',
        abstract: '',
        keywords: '',
        year: abstractBook.year,
        pdf: null,
        _method: 'POST'
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/symposium/abstract-book/${abstractBook.id}/articles`, {
            onSuccess: () => reset('title', 'author', 'abstract', 'keywords', 'pdf'),
            forceFormData: true,
        });
    };

    const startEdit = (article) => {
        setEditingArticle(article.id);
        setEditData({
            title: article.title || '',
            author: article.author || '',
            abstract: article.abstract || '',
            keywords: article.keywords || '',
            year: article.year || abstractBook.year,
            pdf: null,
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        postEdit(`/editor/symposium/article/${editingArticle}`, {
            onSuccess: () => {
                setEditingArticle(null);
                resetEdit();
            },
            forceFormData: true,
        });
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <Head title="Manage Articles" />
            
            <div className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 font-serif">Articles</h1>
                <p className="text-gray-500">Abstract Book: {abstractBook.version} ({abstractBook.year})</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Article Details</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {articles.map(article => (
                                    <tr key={article.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{article.title}</div>
                                            <div className="text-sm text-gray-500">{article.author}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3 font-bold text-sm">
                                                <a href={article.pdf_url} target="_blank" className="text-blue-600 hover:underline">View PDF</a>
                                                <button onClick={() => startEdit(article)} className="text-green-600 hover:underline">Edit</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                        {editingArticle ? 'Edit Article' : 'Add New Article'}
                    </h2>
                    
                    {editingArticle && (
                         <button onClick={() => setEditingArticle(null)} className="mb-4 text-xs text-gray-500 hover:underline">← Back to Create</button>
                    )}

                    <form onSubmit={editingArticle ? submitEdit : submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input className="w-full border rounded-lg p-2" value={editingArticle ? editData.title : data.title} onChange={e => editingArticle ? setEditData('title', e.target.value) : setData('title', e.target.value)} required />
                            {(editingArticle ? editErrors.title : errors.title) && <div className="text-red-500 text-xs mt-1">{editingArticle ? editErrors.title : errors.title}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author(s)</label>
                            <input className="w-full border rounded-lg p-2" value={editingArticle ? editData.author : data.author} onChange={e => editingArticle ? setEditData('author', e.target.value) : setData('author', e.target.value)} required />
                            {(editingArticle ? editErrors.author : errors.author) && <div className="text-red-500 text-xs mt-1">{editingArticle ? editErrors.author : errors.author}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
                            <textarea rows="4" className="w-full border rounded-lg p-2" value={editingArticle ? editData.abstract : data.abstract} onChange={e => editingArticle ? setEditData('abstract', e.target.value) : setData('abstract', e.target.value)} required></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                            <input className="w-full border rounded-lg p-2" value={editingArticle ? editData.keywords : data.keywords} onChange={e => editingArticle ? setEditData('keywords', e.target.value) : setData('keywords', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Article PDF</label>
                            <input type="file" className="w-full text-sm" onChange={e => editingArticle ? setEditData('pdf', e.target.files[0]) : setData('pdf', e.target.files[0])} required={!editingArticle} />
                            {(editingArticle ? editErrors.pdf : errors.pdf) && <div className="text-red-500 text-xs mt-1">{editingArticle ? editErrors.pdf : errors.pdf}</div>}
                        </div>
                        <button type="submit" disabled={editingArticle ? processing : processing} className="w-full bg-[#1f3a5f] text-white py-2 rounded-lg font-bold hover:bg-blue-800 transition">
                            {editingArticle ? 'Update Article' : 'Upload Article'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
