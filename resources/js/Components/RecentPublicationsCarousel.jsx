import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';

export default function RecentPublicationsCarousel({ items, title = "Recent Publications" }) {
    if (!items || items.length === 0) return null;

    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <section className="mb-20">
            <h2 className="text-3xl font-extrabold text-blue-900 mb-8">{title}</h2>
            <div className="relative group">
                <button 
                    onClick={scrollLeft}
                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                
                <div 
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto pb-6 snap-x no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item, index) => (
                        <Link 
                            key={`${item.type}-${item.id}`} 
                            href={
                                item.type === 'issue' ? `/journal/${item.journal_id}/archive#issue-${item.id}` : 
                                item.type === 'conference' ? `/conference/${item.conference_id}/archive#proceeding-${item.id}` : 
                                `/symposium/${item.symposium_id}/archive#proceeding-${item.id}`
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
                                <p className="text-sm text-gray-500 group-hover/card:text-blue-900 transition-colors">
                                    {item.type === 'issue' ? `Volume - ${item.volume}, Issue - ${item.issue}` : `${item.year} - ${item.version}`}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <button 
                    onClick={scrollRight}
                    className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </section>
    );
}
