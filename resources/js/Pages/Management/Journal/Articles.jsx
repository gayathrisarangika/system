import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Articles({ issue, articles }) {
    const { data, setData, post, reset, errors } = useForm({
        title: '',
        author: '',
        abstract: '',
        keywords: '',
        year: issue.year,
        pdf: null
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/journal/issue/${issue.id}/articles`, {
            onSuccess: () => reset()
        });
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <Head title="Manage Articles" />
            <h1 className="text-2xl font-bold mb-6">Articles for Vol. {issue.volume} No. {issue.issue}</h1>

            <form onSubmit={submit} className="bg-gray-50 p-6 rounded mb-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1">Title</label>
                        <input className="w-full border p-2 rounded" value={data.title} onChange={e => setData('title', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Author(s)</label>
                        <input className="w-full border p-2 rounded" value={data.author} onChange={e => setData('author', e.target.value)} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm mb-1">Abstract</label>
                    <textarea className="w-full border p-2 rounded" rows="4" value={data.abstract} onChange={e => setData('abstract', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1">Keywords</label>
                        <input className="w-full border p-2 rounded" value={data.keywords} onChange={e => setData('keywords', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">PDF File</label>
                        <input type="file" onChange={e => setData('pdf', e.target.files[0])} />
                    </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Article</button>
            </form>

            <div className="space-y-4">
                {articles.map(article => (
                    <div key={article.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                        <div>
                            <h4 className="font-bold">{article.title}</h4>
                            <p className="text-sm text-gray-500">{article.author}</p>
                        </div>
                        <div className="flex gap-4">
                            <a href={article.pdf} target="_blank" className="text-blue-600">View PDF</a>
                            <button className="text-red-500">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
