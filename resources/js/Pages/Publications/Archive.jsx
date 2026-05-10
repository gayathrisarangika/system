import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Archive({ journal, conference, symposium, is_current = false }) {
    const publication = journal || conference || symposium;
    const type = journal ? 'journal' : (conference ? 'conference' : 'symposium');
    const title = publication.journal_title || publication.conference_title || publication.symposium_title;
    const items = publication.issues || publication.proceedings;
    const itemLabel = journal ? 'Issue' : 'Abstract Book';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={`${is_current ? 'Current' : 'Archive'} - ${title}`} />
            
            {/* Header */}
            <header className="bg-white border-b py-8 shadow-sm">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 leading-tight">{title}</h1>
                        <p className="text-lg text-gray-600 mt-2 uppercase tracking-widest font-medium">{publication.university_name}</p>
                    </div>
                    {publication.university_logo_url && (
                        <div className="flex-shrink-0">
                            <img src={publication.university_logo_url} alt="University Logo" className="h-28 object-contain" />
                        </div>
                    )}
                </div>
            </header>

            {/* Navigation Bar */}
            <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center md:justify-start">
                        <Link href={`/${type}/${publication.id}`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Home</Link>
                        <Link
                            href={`/${type}/${publication.id}/${journal ? 'editorial-board' : 'committee'}`}
                            className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800"
                        >
                            {journal ? 'Editorial' : 'Committee'}
                        </Link>
                        <Link href={`/${type}/${publication.id}/current`} className={`px-6 py-4 transition font-medium border-r border-blue-800 ${is_current ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>Current</Link>
                        <Link href={`/${type}/${publication.id}/archive`} className={`px-6 py-4 transition font-medium ${!is_current ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>Archive</Link>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-10 flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-blue-900 inline-block">
                    {is_current ? `Current ${itemLabel}` : `${itemLabel} Archive`}
                </h2>

                <div className="space-y-12">
                    {items && items.length > 0 ? (
                        items.map(item => (
                            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-8 py-4 border-b flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-blue-900 font-serif">
                                        {journal ? `Vol. ${item.volume} No. ${item.issue} (${item.year})` : `${item.version} (${item.year})`}
                                    </h3>
                                    <div className="flex gap-2">
                                        {item.pdf_link_url && (
                                            <a href={item.pdf_link_url} target="_blank" className="text-sm bg-blue-900 text-white px-4 py-1 rounded hover:bg-blue-800 transition">
                                                Full {itemLabel} PDF
                                            </a>
                                        )}
                                        {journal && item.pdf_link_url && (
                                            <a href={`/issue/${item.id}/download`} className="text-sm border border-blue-900 text-blue-900 px-4 py-1 rounded hover:bg-blue-50 transition">
                                                Download
                                            </a>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-8">
                                    <div className="space-y-8 divide-y divide-gray-100">
                                        {item.articles && item.articles.length > 0 ? (
                                            item.articles.map(article => (
                                                <div key={article.id} className="pt-8 first:pt-0">
                                                    <Link href={`/article/${article.id}`} className="block group">
                                                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition leading-tight mb-2">
                                                            {article.title}
                                                        </h4>
                                                    </Link>
                                                    <p className="text-gray-600 mb-4">{article.author.replace(/[\d*]/g, '')}</p>
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <Link href={`/article/${article.id}`} className="text-blue-900 font-bold hover:underline">Abstract</Link>
                                                        {article.pdf_url && (
                                                            <a href={article.pdf_url} target="_blank" className="text-blue-900 font-bold hover:underline flex items-center gap-1">
                                                                <span>PDF</span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 italic">No articles published in this {itemLabel.toLowerCase()}.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">No {itemLabel.toLowerCase()}s found.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} {publication.university_name}. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}
