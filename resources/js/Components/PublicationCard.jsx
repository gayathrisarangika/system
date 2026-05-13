import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicationCard({
    href,
    image,
    title,
    subtitle,
    type,
    className
}) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn("group relative h-full", className)}
        >
            <Link href={href} className="block h-full">
                <div className="relative h-full flex flex-col bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">

                    {/* Image Section */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                        {image ? (
                            <motion.img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center p-8 text-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-0 -left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
                                    <div className="absolute bottom-0 -right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse delay-700"></div>
                                </div>
                                <span className="relative z-10 text-white font-serif font-bold text-xl leading-tight drop-shadow-md">
                                    {title}
                                </span>
                            </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                            <span className="text-white text-sm font-medium flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                View Publication <ExternalLink size={14} />
                            </span>
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-blue-900 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                                {type}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col justify-between relative bg-white/50">
                        <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2 mb-2 leading-snug">
                                {title}
                            </h4>
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 uppercase tracking-wide">
                                <BookOpen size={12} className="text-blue-500" />
                                {subtitle}
                            </p>
                        </div>

                        {/* Bottom Glow Effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
