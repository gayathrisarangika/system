import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Home({ journals, conferences, symposiums, recent_issues, recent_conference_proceedings, recent_symposium_proceedings }) {
    const recentItems = [
        ...recent_issues.map(i => ({ ...i, type: 'issue', sortDate: i.created_at })),
        ...recent_conference_proceedings.map(p => ({ ...p, type: 'conference', sortDate: p.created_at })),
        ...recent_symposium_proceedings.map(p => ({ ...p, type: 'symposium', sortDate: p.created_at }))
    ].sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate)).slice(0, 10);

    const scrollLeft = () => {
        document.getElementById('recent-publications-scroll').scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        document.getElementById('recent-publications-scroll').scrollBy({ left: 300, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Home" />
            
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">P</div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-gray-900 leading-none">Publication Management System</h1>
                            <p className="text-sm text-gray-500 font-medium tracking-tight">Faculty of Social Sciences and Languages</p>
                        </div>
                    </div>
                    <Link 
                        href="/backend-login"
                        className="bg-blue-900 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-800 transition"
                    >
                        Backend Login
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                <section className="mb-16 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Academic Publications</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Access our latest journals, conference proceedings, and symposia from the Faculty of Social Sciences and Languages.</p>
                </section>

                {recentItems.length > 0 && (
                    <section className="mb-20">
                        <h2 className="text-3xl font-extrabold text-blue-900 mb-8">Recent Publications</h2>
                        <div className="relative group">
                            <button 
                                onClick={scrollLeft}
                                className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gray-800/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-900"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            
                            <div 
                                id="recent-publications-scroll"
                                className="flex gap-8 overflow-x-auto pb-6 snap-x no-scrollbar"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {recentItems.map((item, index) => (
                                    <Link 
                                        key={`${item.type}-${item.id}`} 
                                        href={
                                            item.type === 'issue' ? `/journal/${item.journal_id}` : 
                                            item.type === 'conference' ? `/conference/${item.conference_id}` : 
                                            `/symposium/${item.symposium_id}`
                                        }
                                        className="flex-none w-52 snap-start group/card"
                                    >
                                        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover/card:shadow-xl group-hover/card:-translate-y-2 border border-gray-100">
                                            {item.cover_image_url ? (
                                                <div className="aspect-[3/4] overflow-hidden">
                                                    <img 
                                                        src={item.cover_image_url} 
                                                        alt="Cover" 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" 
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-[3/4] bg-blue-900 flex items-center justify-center p-6 text-center">
                                                    <span className="text-white text-sm font-bold leading-tight">
                                                        {item.journal?.journal_title || item.conference?.conference_title || item.symposium?.symposium_title}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 text-center">
                                            <p className="text-sm font-bold text-gray-700 group-hover/card:text-blue-900 transition-colors">
                                                {item.type === 'issue' ? `Volume - ${item.volume}, Issue - ${item.issue}` : `${item.year} - ${item.version}`}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                                                {item.type === 'issue' ? 'Journal' : item.type === 'conference' ? 'Conference' : 'Symposium'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <button 
                                onClick={scrollRight}
                                className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gray-800/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-900"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </section>
                )}

                {journals.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">Journals</h3>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {journals.map(journal => (
                                <Link key={journal.id} href={`/journal/${journal.id}`} className="group">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
                                        {journal.cover_image_url ? (
                                            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                                <img 
                                                    src={journal.cover_image_url} 
                                                    alt={journal.journal_title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-[3/4] bg-blue-900 flex items-center justify-center p-6 text-center">
                                                <span className="text-white font-serif font-bold text-lg leading-tight">{journal.journal_title}</span>
                                            </div>
                                        )}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">{journal.journal_title}</h4>
                                            <p className="text-sm text-gray-500">{journal.university_name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {conferences.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">Conferences</h3>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {conferences.map(conf => (
                                <Link key={conf.id} href={`/conference/${conf.id}`} className="group">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
                                        {conf.cover_image_url ? (
                                            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                                <img 
                                                    src={conf.cover_image_url} 
                                                    alt={conf.conference_title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-[3/4] bg-blue-900 flex items-center justify-center p-6 text-center">
                                                <span className="text-white font-serif font-bold text-lg leading-tight">{conf.conference_title}</span>
                                            </div>
                                        )}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">{conf.conference_title}</h4>
                                            <p className="text-sm text-gray-500">{conf.university_name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {symposiums.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">Symposiums</h3>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {symposiums.map(symp => (
                                <Link key={symp.id} href={`/symposium/${symp.id}`} className="group">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
                                        {symp.cover_image_url ? (
                                            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                                <img 
                                                    src={symp.cover_image_url} 
                                                    alt={symp.symposium_title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-[3/4] bg-blue-900 flex items-center justify-center p-6 text-center">
                                                <span className="text-white font-serif font-bold text-lg leading-tight">{symp.symposium_title}</span>
                                            </div>
                                        )}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">{symp.symposium_title}</h4>
                                            <p className="text-sm text-gray-500">{symp.university_name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {journals.length === 0 && conferences.length === 0 && symposiums.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 italic">No approved publications available at this time.</p>
                    </div>
                )}
            </main>

            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-gray-700 pb-8 mb-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold">Publication Management System</h2>
                            <p className="text-gray-400 mt-1">Faculty of Social Sciences and Languages</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-gray-400">Sabaragamuwa University of Sri Lanka</p>
                            <p className="text-gray-400 text-sm mt-1">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
