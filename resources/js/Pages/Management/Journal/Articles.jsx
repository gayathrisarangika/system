import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import BackendLayout from '@/Layouts/BackendLayout';

export default function Articles({ issue, articles }) {
    const [editingArticle, setEditingArticle] = useState(null);

    const { data, setData, post, reset, errors } = useForm({
        title: '',
        author: '',
        abstract: '',
        keywords: '',
        doi: '',
        published_date: '',
        pages: '',
        year: issue.year,
        pdf: null,
    });

    const { data: editData, setData: setEditData, post: postEdit, errors: editErrors, reset: resetEdit } = useForm({
        title: '',
        author: '',
        abstract: '',
        keywords: '',
        doi: '',
        published_date: '',
        pages: '',
        year: issue.year,
        pdf: null,
        _method: 'POST'
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/journal/issue/${issue.id}/articles`, {
            onSuccess: () => reset(),
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
            doi: article.doi || '',
            published_date: article.published_date || '',
            pages: article.pages || '',
            year: article.year || issue.year,
            pdf: null,
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        postEdit(`/editor/journal/article/${editingArticle}`, {
            onSuccess: () => {
                setEditingArticle(null);
                resetEdit();
            },
            forceFormData: true,
        });
    };

    return (
        <BackendLayout title={`Articles - Vol. ${issue.volume} No. ${issue.issue}`}>
            <Head title="Manage Articles" />
            <h1 className="text-2xl font-bold mb-8 text-slate-900">Articles for Vol. {issue.volume} No. {issue.issue}</h1>

            {editingArticle ? (
                <div className="bg-white p-8 rounded-2xl mb-12 border border-blue-200 shadow-sm shadow-blue-500/5">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-slate-900">Edit Article</h2>
                        <button onClick={() => setEditingArticle(null)} className="text-slate-500 hover:text-slate-700 font-bold uppercase text-xs tracking-wider">Cancel</button>
                    </div>
                    <form onSubmit={submitEdit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Title</label>
                                <input className="w-full border p-2 rounded" value={editData.title} onChange={e => setEditData('title', e.target.value)} />
                                {editErrors.title && <div className="text-red-500 text-sm">{editErrors.title}</div>}
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Author(s)</label>
                                <input className="w-full border p-2 rounded" value={editData.author} onChange={e => setEditData('author', e.target.value)} />
                                {editErrors.author && <div className="text-red-500 text-sm">{editErrors.author}</div>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Abstract</label>
                            <textarea className="w-full border p-2 rounded" rows="4" value={editData.abstract} onChange={e => setEditData('abstract', e.target.value)} />
                            {editErrors.abstract && <div className="text-red-500 text-sm">{editErrors.abstract}</div>}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Keywords</label>
                                <input className="w-full border p-2 rounded" value={editData.keywords} onChange={e => setEditData('keywords', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">DOI</label>
                                <input className="w-full border p-2 rounded" value={editData.doi} onChange={e => setEditData('doi', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Pages</label>
                                <input className="w-full border p-2 rounded" placeholder="e.g. 1-10" value={editData.pages} onChange={e => setEditData('pages', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Published Date</label>
                                <input type="date" className="w-full border p-2 rounded" value={editData.published_date} onChange={e => setEditData('published_date', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Article PDF</label>
                                <input type="file" className="w-full border p-2 rounded" onChange={e => setEditData('pdf', e.target.files[0])} />
                                {editErrors.pdf && <div className="text-red-500 text-sm">{editErrors.pdf}</div>}
                            </div>
                        </div>
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">Update Article</button>
                    </form>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-2xl mb-12 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold mb-8 text-slate-900">Add New Article</h2>
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm mb-1">Title</label>
                            <input className="w-full border p-2 rounded" value={data.title} onChange={e => setData('title', e.target.value)} />
                            {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Author(s)</label>
                            <input className="w-full border p-2 rounded" value={data.author} onChange={e => setData('author', e.target.value)} />
                            {errors.author && <div className="text-red-500 text-sm">{errors.author}</div>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Abstract</label>
                        <textarea className="w-full border p-2 rounded" rows="4" value={data.abstract} onChange={e => setData('abstract', e.target.value)} />
                        {errors.abstract && <div className="text-red-500 text-sm">{errors.abstract}</div>}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Keywords</label>
                            <input className="w-full border p-2 rounded" value={data.keywords} onChange={e => setData('keywords', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">DOI</label>
                            <input className="w-full border p-2 rounded" value={data.doi} onChange={e => setData('doi', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Pages</label>
                            <input className="w-full border p-2 rounded" placeholder="e.g. 1-10" value={data.pages} onChange={e => setData('pages', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Published Date</label>
                            <input type="date" className="w-full border p-2 rounded" value={data.published_date} onChange={e => setData('published_date', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Article PDF</label>
                            <input type="file" className="w-full border p-2 rounded" onChange={e => setData('pdf', e.target.files[0])} />
                            {errors.pdf && <div className="text-red-500 text-sm">{errors.pdf}</div>}
                        </div>
                    </div>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">Add Article</button>
                </form>
                </div>
            )}

            <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Existing Articles</h2>
                {articles.map(article => (
                    <div key={article.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                        <div>
                            <h4 className="font-bold">{article.title}</h4>
                            <p className="text-sm text-gray-500">{article.author}</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => startEdit(article)} className="text-green-600 hover:underline">Edit</button>
                        </div>
                    </div>
                ))}
            </div>
        </BackendLayout>
    );
}
