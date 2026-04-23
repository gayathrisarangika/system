import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Archive({ journal }) {
    return (
        <div className="min-h-screen bg-white">
            <Head title={`Archive - ${journal.journal_title}`} />

            <header className="bg-gray-100 py-10 px-6 text-center border-b">
                <h1 className="text-4xl font-bold text-gray-900">{journal.journal_title}</h1>
                <h2 className="text-2xl text-blue-900 mt-2 font-semibold">Issue Archive</h2>
            </header>

            <nav className="bg-blue-900 text-white flex justify-center gap-8 py-3 sticky top-0 z-10 shadow-md">
                <Link href={`/journal/${journal.id}`} className="hover:text-blue-200 font-medium">Home</Link>
                <Link href={`/journal/${journal.id}/editorial-board`} className="hover:text-blue-200 font-medium">Editorial Board</Link>
                <Link href={`/journal/${journal.id}/archive`} className="hover:text-blue-200 font-medium">Issue Archive</Link>
            </nav>

            <main className="container mx-auto px-4 py-12 max-w-5xl">
                {journal.issues && journal.issues.length > 0 ? (
                    <div className="space-y-16">
                        {journal.issues.map(issue => (
                            <div key={issue.id} className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="md:w-48 flex-shrink-0">
                                        <img src={issue.cover_image} alt={`Issue ${issue.issue}`} className="w-full rounded shadow-lg" />
                                        <div className="mt-4 text-center">
                                            <p className="font-bold text-gray-800">Vol. {issue.volume} No. {issue.issue}</p>
                                            <p className="text-gray-500 text-sm">Year {issue.year}</p>
                                            {issue.pdf_link && (
                                                <a
                                                    href={issue.pdf_link}
                                                    target="_blank"
                                                    className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                                                >
                                                    Full Issue PDF
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full">
                                        <h3 className="text-xl font-bold text-blue-900 mb-6 border-b pb-2">Articles in this Issue</h3>
                                        <div className="space-y-6">
                                            {issue.articles && issue.articles.length > 0 ? (
                                                issue.articles.map(article => (
                                                    <div key={article.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-blue-300 transition">
                                                        <h4 className="text-lg font-bold text-gray-900 leading-tight mb-2">{article.title}</h4>
                                                        <p className="text-blue-700 text-sm font-medium mb-3 italic">{article.author}</p>
                                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.abstract}</p>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-400">Keywords: {article.keywords}</span>
                                                            <a href={article.pdf} target="_blank" className="text-blue-600 hover:underline font-semibold flex items-center gap-1">
                                                                <span>PDF</span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 italic">No articles found for this issue.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 text-xl italic">The archive is currently empty.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
