import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Article({ article, journal }) {
    const formatAuthors = (authorStr) => {
        return authorStr.split(',').map((author, index) => {
            const parts = author.trim().split(/(\d+|\*)/);
            return (
                <span key={index} className="hover:underline cursor-pointer">
                    {parts.map((part, i) => (
                        /(\d+|\*)/.test(part) ? <sup key={i} className="text-xs">{part}</sup> : part
                    ))}
                    {index < authorStr.split(',').length - 1 ? ', ' : ''}
                </span>
            );
        });
    };

    const getIEEECitation = () => {
        const authors = article.author.split(',').map(a => a.trim().replace(/[\d*]/g, ''));
        const authorList = authors.length > 3 ? `${authors[0]} et al.` : authors.join(', ');
        return `${authorList}, "${article.title}," ${journal.journal_title}, vol. ${article.issue.volume}, no. ${article.issue.issue}, pp. ${article.pages || 'n/a'}, ${article.year}.`;
    };

    const shareUrl = window.location.href;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head>
                <title>{article.title}</title>
                <meta name="description" content={article.abstract.substring(0, 160)} />
                <meta name="keywords" content={article.keywords} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.abstract.substring(0, 160)} />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary" />
                <meta name="citation_title" content={article.title} />
                <meta name="citation_author" content={article.author} />
                <meta name="citation_publication_date" content={article.published_date || article.created_at} />
                <meta name="citation_journal_title" content={journal.journal_title} />
                <meta name="citation_volume" content={article.issue.volume} />
                <meta name="citation_issue" content={article.issue.issue} />
                <meta name="citation_pdf_url" content={article.pdf?.startsWith('http') ? article.pdf : (article.pdf ? window.location.origin + article.pdf : '')} />
            </Head>
            
            {/* Header */}
            <header className="bg-white border-b py-8 shadow-sm">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 leading-tight">{journal.journal_title}</h1>
                        <p className="text-lg text-gray-600 mt-2 uppercase tracking-widest font-medium">{journal.university_name}</p>
                    </div>
                </div>
            </header>

            {/* Navigation Bar */}
            <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center md:justify-start">
                        <Link href={`/journal/${journal.id}`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Home</Link>
                        <Link href={`/journal/${journal.id}/editorial-board`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Editorial Board</Link>
                        <Link href={`/journal/${journal.id}/archive`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Current</Link>
                        <Link href={`/journal/${journal.id}/archive`} className="px-6 py-4 hover:bg-blue-800 transition font-medium">Archive</Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-10 flex-1">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Main Content */}
                    <div className="flex-1 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                        <nav className="text-sm text-gray-500 mb-8 flex gap-2 items-center overflow-x-auto whitespace-nowrap">
                            <Link href="/" className="hover:text-blue-900">Home</Link>
                            <span>/</span>
                            <Link href={`/journal/${journal.id}`} className="hover:text-blue-900">{journal.journal_title}</Link>
                            <span>/</span>
                            <Link href={`/journal/${journal.id}/archive`} className="hover:text-blue-900">Vol. {article.issue.volume} No. {article.issue.issue}</Link>
                        </nav>

                        <header className="mb-10">
                            <p className="text-blue-900 font-bold mb-2">Original Research Article</p>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 leading-tight mb-4">{article.title}</h2>
                            <div className="flex flex-wrap gap-2 text-lg text-blue-700 font-medium mb-6">
                                {formatAuthors(article.author)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-y border-gray-100 text-sm text-gray-600">
                                <div>
                                    <p><span className="font-bold">DOI:</span> {article.doi || `10.18535/ijsrm/v${article.issue.volume}i${article.issue.issue}.${article.id}`}</p>
                                </div>
                                <div>
                                    <p><span className="font-bold">Published:</span> {new Date(article.published_date || article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p><span className="font-bold">Issue:</span> Vol {article.issue.volume} No {article.issue.issue} ({article.year})</p>
                                </div>
                            </div>
                        </header>

                        <section className="mb-10">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Abstract</h3>
                            <div className="prose max-w-none text-gray-700 leading-relaxed font-serif text-lg whitespace-pre-wrap text-justify">
                                {article.abstract}
                            </div>
                        </section>

                        <section className="mb-10">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Keywords</h3>
                            <p className="text-gray-700 italic">{article.keywords || "No keywords available."}</p>
                        </section>

                        <div className="flex gap-4 mt-12">
                            <a
                                href={`/article/${article.id}/download`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-900 text-white px-8 py-3 rounded font-bold hover:bg-blue-800 transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Download PDF
                            </a>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 flex flex-col gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">How to Cite (IEEE)</h4>
                            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded border border-gray-100 font-serif break-words">
                                {getIEEECitation()}
                            </div>
                            <button 
                                onClick={() => navigator.clipboard.writeText(getIEEECitation())}
                                className="mt-4 text-blue-700 text-sm font-bold hover:underline flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy Citation
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Article Metrics</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Views</span>
                                    <span className="font-bold text-blue-900">{article.views.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">PDF Downloads</span>
                                    <span className="font-bold text-blue-900">{article.downloads.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-900 text-white p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-bold mb-4 border-b border-blue-700 pb-2">Social Share</h4>
                            <div className="flex gap-4">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer transition">F</a>
                                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${article.title}`} target="_blank" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer transition">X</a>
                                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`} target="_blank" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer transition">L</a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-10">
                <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} {journal.university_name}. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}
