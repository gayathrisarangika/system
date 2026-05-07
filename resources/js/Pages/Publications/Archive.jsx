import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Archive({ journal, is_current }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={`${is_current ? 'Current' : 'Archive'} - ${journal.journal_title}`} />
            
            <header className="bg-white border-b py-8 shadow-sm">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 text-center md:text-left leading-tight">{journal.journal_title}</h1>
                    <p className="text-lg text-gray-600 mt-2 uppercase tracking-widest font-medium text-center md:text-left">{journal.university_name}</p>
                </div>
            </header>

            <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center md:justify-start">
                        <Link href={`/journal/${journal.id}`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Home</Link>
                        <Link href={`/journal/${journal.id}/editorial-board`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Editorial Board</Link>
                        <Link href={`/journal/${journal.id}/current`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Current</Link>
                        <Link href={`/journal/${journal.id}/archive`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Archive</Link>
                        <Link href={`/journal/${journal.id}/contact`} className="px-6 py-4 hover:bg-blue-800 transition font-medium">Contact Us</Link>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12 flex-1">
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-10 border-b-2 border-blue-900 pb-2 inline-block">
                    {is_current ? 'Current Issue' : 'Issue Archive'}
                </h2>
                
                {journal.issues && journal.issues.length > 0 ? (
                    <div className="space-y-12">
                        {journal.issues.map(issue => (
                            <div key={issue.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-8 py-4 border-b flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-blue-900">Vol. {issue.volume} No. {issue.issue} ({issue.year})</h3>
                                    {issue.pdf_url && (
                                        <div className="flex gap-4">
                                            <a href={issue.pdf_url} target="_blank" className="bg-white border border-blue-900 text-blue-900 px-4 py-1.5 rounded-md text-sm font-bold hover:bg-blue-50 transition">View Full Issue</a>
                                            <a href={`/issue/${issue.id}/download`} className="bg-blue-900 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-blue-800 transition">Download Issue</a>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8">
                                    <div className="space-y-8">
                                        {issue.articles && issue.articles.length > 0 ? (
                                            issue.articles.map(article => (
                                                <div key={article.id} className="group border-b border-gray-50 pb-8 last:border-0 last:pb-0">
                                                    <Link href={`/article/${article.id}`} className="block">
                                                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition leading-tight mb-2 font-serif">{article.title}</h4>
                                                    </Link>
                                                    <p className="text-blue-700 text-sm font-medium mb-3">{article.author}</p>
                                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed text-justify">{article.abstract}</p>
                                                    <div className="flex flex-wrap justify-between items-center gap-4">
                                                        <div className="flex gap-4">
                                                            <Link href={`/article/${article.id}`} className="text-blue-900 font-bold text-sm hover:underline">Abstract</Link>
                                                        </div>
                                                        <span className="text-xs text-gray-400">Published: {new Date(article.published_date || article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 italic">No articles found for this issue.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-400 text-xl italic font-serif">The archive is currently empty.</p>
                    </div>
                )}
            </main>

            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="container mx-auto px-6 text-center text-gray-400 text-sm font-serif">
                    <p>&copy; {new Date().getFullYear()} {journal.university_name}. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}
