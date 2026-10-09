import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BackendLayout from '@/Layouts/BackendLayout';
import { 
    Search, 
    Filter, 
    ChevronRight, 
    ChevronDown, 
    ArrowUpDown, 
    Eye, 
    Send, 
    Settings, 
    BookOpen 
} from 'lucide-react';
import { u, cn } from '@/lib/utils';

export default function JournalSubmissions({ journal, submissions, filters, statusOptions }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');
    const [sort, setSort] = useState(filters.sort || 'created_at');
    const [direction, setDirection] = useState(filters.direction || 'desc');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            u(`/editor/journal/${journal.id}/submissions`),
            { search, status, sort, direction },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterStatus = (newStatus) => {
        setStatus(newStatus);
        router.get(
            u(`/editor/journal/${journal.id}/submissions`),
            { search, status: newStatus, sort, direction },
            { preserveState: true, replace: true }
        );
    };

    const handleSort = (column) => {
        const newDir = sort === column && direction === 'asc' ? 'desc' : 'asc';
        setSort(column);
        setDirection(newDir);
        router.get(
            u(`/editor/journal/${journal.id}/submissions`),
            { search, status, sort: column, direction: newDir },
            { preserveState: true, replace: true }
        );
    };

    return (
        <BackendLayout title={`Submissions - ${journal.journal_title}`}>
            <Head title={`Paper Submissions | ${journal.journal_title}`} />

            <div className="space-y-6">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
                    <div>
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-1">
                            <Send size={14} />
                            <span>Paper Submissions Dashboard</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">{journal.journal_title}</h1>
                    </div>

                    <Link
                        href={u(`/editor/journal/${journal.id}/submission-settings`)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all self-start sm:self-auto"
                    >
                        <Settings size={15} />
                        Configure Submission Settings
                    </Link>
                </div>

                {/* Filters & Search Controls */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
                        <input
                            type="text"
                            placeholder="Search Paper ID, Title, Author..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </form>

                    {/* Status Dropdown Filter */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <Filter size={14} /> Status:
                        </span>
                        <select
                            value={status}
                            onChange={(e) => handleFilterStatus(e.target.value)}
                            className="px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700 focus:border-blue-500"
                        >
                            <option value="All">All Statuses</option>
                            {statusOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                                    <th 
                                        onClick={() => handleSort('paper_id')}
                                        className="py-4 px-6 cursor-pointer hover:text-slate-900 select-none"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            Paper ID
                                            <ArrowUpDown size={12} />
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('title')}
                                        className="py-4 px-6 cursor-pointer hover:text-slate-900 select-none"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            Title
                                            <ArrowUpDown size={12} />
                                        </div>
                                    </th>
                                    <th className="py-4 px-6">Corresponding Author</th>
                                    <th 
                                        onClick={() => handleSort('status')}
                                        className="py-4 px-6 cursor-pointer hover:text-slate-900 select-none"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            Status
                                            <ArrowUpDown size={12} />
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('submitted_at')}
                                        className="py-4 px-6 cursor-pointer hover:text-slate-900 select-none"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            Submitted Date
                                            <ArrowUpDown size={12} />
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                                {submissions.data.map((item) => {
                                    const author = item.authors ? item.authors.find(a => a.is_corresponding) || item.authors[0] : null;

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-4 px-6 font-mono font-bold text-blue-700">
                                                {item.paper_id}
                                            </td>
                                            <td className="py-4 px-6 max-w-xs font-bold text-slate-900 truncate">
                                                {item.title}
                                            </td>
                                            <td className="py-4 px-6 text-xs text-slate-600">
                                                {author ? (
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">{author.full_name}</span>
                                                        <span className="text-slate-400 block">{author.email}</span>
                                                    </div>
                                                ) : 'N/A'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-xs text-slate-500">
                                                {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Link
                                                    href={u(`/editor/submission/${item.id}`)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-sm"
                                                >
                                                    <Eye size={14} />
                                                    View Submission
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {submissions.data.length === 0 && (
                        <div className="text-center py-16 p-6">
                            <p className="text-slate-500 font-bold">No submissions match the current criteria.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {submissions.links && submissions.links.length > 3 && (
                        <div className="p-6 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">
                                Showing {submissions.from || 0} to {submissions.to || 0} of {submissions.total} submissions
                            </span>
                            <div className="flex items-center gap-1">
                                {submissions.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                            link.active 
                                                ? "bg-blue-600 text-white" 
                                                : link.url 
                                                    ? "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200" 
                                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </BackendLayout>
    );
}
