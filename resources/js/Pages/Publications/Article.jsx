import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { 
    FileText, 
    Calendar, 
    User, 
    Download, 
    Eye, 
    Share2, 
    Quote, 
    ChevronLeft,
    Clock,
    BookOpen,
    ExternalLink,
    Check,
    Copy,
    Send,
    Link2,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Article({ article, journal, conference, symposium }) {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState("abstract");
    
    const publication = journal || conference || symposium;
    const type = journal ? 'journal' : (conference ? 'conference' : 'symposium');

    // Process authors for display
    const authors = article.author ? article.author.split(/,|\band\b/).map(s => s.trim()) : [];

    const handleCopyCitation = () => {
        const citation = document.getElementById('citation-text')?.innerText;
        if (citation) {
            navigator.clipboard.writeText(citation);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const citationIEEE = `${authors.length > 3 ? authors[0] + " et al." : authors.join(", ")}, "${article.title}," ${publication?.journal_title || publication?.conference_title || publication?.symposium_title}, ${article.issue ? `vol. ${article.issue.volume}, no. ${article.issue.issue},` : ''} ${article.conference_proceeding ? 'Conference Proceedings,' : ''} ${article.symposium_proceeding ? 'Symposium Proceedings,' : ''} pp. ${article.pages || '??'}, ${article.year}.`;

    const breadcrumbLinks = [
        { label: "Archive", href: `/${type}/${publication.id}/archive` },
        { 
            label: article.issue ? `Vol. ${article.issue.volume} No. ${article.issue.issue}` : (article.conference_proceeding ? 'Abstract Book' : 'Abstract Book'), 
            href: `/${type}/${publication.id}/archive#${article.issue ? `issue-${article.issue.id}` : (article.conference_proceeding ? `proceeding-${article.conference_proceeding.id}` : `proceeding-${article.symposium_proceeding.id}`)}` 
        },
        { label: "Article Details", href: "#" }
    ];

    return (
        <PublicLayout publication={publication} type={type}>
            <Head>
                <title>{`${article.title} | ${publication.journal_title || publication.conference_title || publication.symposium_title}`}</title>
                <meta name="description" content={article.abstract?.substring(0, 160)} />
                <meta name="keywords" content={article.keywords} />
                
                {/* Academic Meta Tags */}
                <meta name="citation_title" content={article.title} />
                {authors.map((author, index) => (
                    <meta key={index} name="citation_author" content={author.replace(/[*0-9]/g, '')} />
                ))}
                <meta name="citation_publication_date" content={article.year} />
                <meta name="citation_journal_title" content={publication.journal_title || publication.conference_title || publication.symposium_title} />
                {article.issue && (
                    <>
                        <meta name="citation_volume" content={article.issue.volume} />
                        <meta name="citation_issue" content={article.issue.issue} />
                    </>
                )}
                {article.pdf_url && <meta name="citation_pdf_url" content={window.location.origin + article.pdf_url} />}
                
                {/* OpenGraph */}
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.abstract?.substring(0, 160)} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                {/* Breadcrumbs */}
                <nav className="flex mb-8 items-center space-x-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                    {breadcrumbLinks.map((link, idx) => (
                        <React.Fragment key={idx}>
                            <Link href={link.href} className={cn("hover:text-blue-600 transition-colors", idx === breadcrumbLinks.length - 1 && "font-semibold text-slate-900")}>
                                {link.label}
                            </Link>
                            {idx < breadcrumbLinks.length - 1 && <ChevronLeft className="h-4 w-4 rotate-180" />}
                        </React.Fragment>
                    ))}
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                            <div className="space-y-6">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                    Research Article
                                </div>
                                
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                                    {article.title}
                                </h1>

                                <div className="flex flex-wrap gap-4 text-slate-600">
                                    {authors.map((author, index) => (
                                        <div key={index} className="flex items-center group">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2 group-hover:bg-blue-100 transition-colors">
                                                <User className="h-4 w-4 text-slate-500 group-hover:text-blue-600" />
                                            </div>
                                            <span className="font-medium text-slate-900">
                                                {author.split('*').map((part, i) => (
                                                    <React.Fragment key={i}>
                                                        {part}
                                                        {i < author.split('*').length - 1 && <sup className="text-blue-600 font-bold">*</sup>}
                                                    </React.Fragment>
                                                ))}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-slate-100">
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500 uppercase font-semibold">Published</span>
                                        <div className="flex items-center text-slate-900 font-medium">
                                            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                                            {article.year}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500 uppercase font-semibold">Views</span>
                                        <div className="flex items-center text-slate-900 font-medium">
                                            <Eye className="h-4 w-4 mr-2 text-blue-600" />
                                            {article.views || 0}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500 uppercase font-semibold">Downloads</span>
                                        <div className="flex items-center text-slate-900 font-medium">
                                            <Download className="h-4 w-4 mr-2 text-blue-600" />
                                            {article.downloads || 0}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500 uppercase font-semibold">Pages</span>
                                        <div className="flex items-center text-slate-900 font-medium">
                                            <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                                            {article.pages || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex border-b border-slate-100">
                                        <button 
                                            onClick={() => setActiveTab("abstract")}
                                            className={cn("px-6 py-3 text-sm font-bold transition-all relative", activeTab === "abstract" ? "text-blue-600" : "text-slate-500 hover:text-slate-700")}
                                        >
                                            Abstract
                                            {activeTab === "abstract" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab("details")}
                                            className={cn("px-6 py-3 text-sm font-bold transition-all relative", activeTab === "details" ? "text-blue-600" : "text-slate-500 hover:text-slate-700")}
                                        >
                                            Metadata
                                            {activeTab === "details" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                                        </button>
                                    </div>

                                    <div className="py-4">
                                        {activeTab === "abstract" ? (
                                            <div className="space-y-6">
                                                <p className="text-slate-700 leading-relaxed text-justify">
                                                    {article.abstract}
                                                </p>
                                                {article.keywords && (
                                                    <div className="flex flex-wrap gap-2 pt-4">
                                                        <span className="text-sm font-bold text-slate-900 mr-2">Keywords:</span>
                                                        {article.keywords.split(',').map((kw, i) => (
                                                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                                                {kw.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="block text-slate-500 font-semibold mb-1">DOI</span>
                                                        <span className="text-slate-900">{article.doi || 'Not available'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-slate-500 font-semibold mb-1">Publication Date</span>
                                                        <span className="text-slate-900">{article.year}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="block text-slate-500 font-semibold mb-1">Citation Style</span>
                                                        <span className="text-slate-900">IEEE</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Citation Card */}
                        <section className="bg-slate-900 rounded-3xl p-8 text-white">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <Quote className="h-6 w-6 text-blue-400 mr-3" />
                                    <h3 className="text-xl font-bold">How to Cite</h3>
                                </div>
                                <button 
                                    onClick={handleCopyCitation}
                                    className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium border border-white/10"
                                >
                                    {copied ? <Check className="h-4 w-4 mr-2 text-green-400" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copied ? 'Copied!' : 'Copy IEEE'}
                                </button>
                            </div>
                            <div id="citation-text" className="text-slate-300 leading-relaxed font-mono text-sm bg-black/20 p-6 rounded-2xl border border-white/5">
                                {citationIEEE}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Download Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                                Full Text
                            </h3>
                            <a 
                                href={`/article/${article.id}/download`}
                                className="flex items-center justify-center w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 group"
                            >
                                <Download className="h-5 w-5 mr-3 group-hover:translate-y-0.5 transition-transform" />
                                Download PDF
                            </a>
                            <p className="mt-4 text-center text-xs text-slate-400">
                                Open access provided by Sabaragamuwa University of Sri Lanka
                            </p>
                        </div>

                        {/* Share Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                <Share2 className="h-5 w-5 text-blue-600 mr-2" />
                                Share Article
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors">
                                    <Send className="h-6 w-6" />
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors">
                                    <Link2 className="h-6 w-6" />
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors">
                                    <Mail className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Publication Info */}
                        <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <BookOpen className="h-24 w-24" />
                            </div>
                            <h3 className="text-lg font-bold mb-4 relative z-10">Part of</h3>
                            <div className="space-y-4 relative z-10">
                                <p className="font-medium text-blue-100">
                                    {publication.journal_title || publication.conference_title || publication.symposium_title}
                                </p>
                                <div className="text-sm text-blue-100/80">
                                    {article.issue ? (
                                        <>Volume {article.issue.volume}, Issue {article.issue.issue}</>
                                    ) : (
                                        <>Abstract Book {article.year}</>
                                    )}
                                </div>
                                <Link 
                                    href={`/${type}/${publication.id}`}
                                    className="inline-flex items-center text-sm font-bold text-white hover:underline pt-2"
                                >
                                    View Publication
                                    <ExternalLink className="h-4 w-4 ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
