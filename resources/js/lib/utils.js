import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Prefix an internal app path with the deployment base path (e.g. "/journals").
 *
 * Reads Vite's `import.meta.env.BASE_URL` (set from `base` in vite.config.js),
 * so links resolve to "/journals/..." in production and "/..." in local dev
 * automatically. Pass absolute in-app paths only (starting with "/").
 *
 * @param {string} path - e.g. "/login" or `/journal/${id}`
 * @returns {string} base-prefixed URL, e.g. "/journals/login"
 */
export function u(path = "/") {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, ""); // "/journals" or ""
    if (!path || path === "/") return base || "/";
    return base + (path.startsWith("/") ? path : "/" + path);
}

/**
 * Intelligently splits a string of authors into an array of individual author names.
 * Handles separators like ";", "and", "&", and commas while preserving "Surname, Given" formats.
 * @param {string} authorStr - The raw author string.
 * @param {boolean} clean - Whether to strip affiliation markers (digits/asterisks).
 */
export function splitAuthors(authorStr, clean = false) {
    if (!authorStr) return [];

    // First split by common explicit delimiters
    let parts = authorStr.split(/\s*;\s*|\s+and\s+|\s+&\s+/i)
        .map(s => s.trim())
        .filter(s => s !== "");

    let result = [];
    parts.forEach(p => {
        if (p.includes(",")) {
            // Check if it's "Surname, Given" or "Author 1, Author 2"
            const commaParts = p.split(/\s*,\s*/).filter(s => s !== "");
            
            if (commaParts.length > 2) {
                // More than one comma in a segment usually means it's a list of authors
                result.push(...commaParts);
            } else if (commaParts.length === 2) {
                // Exactly one comma. Could be "Surname, Given" or "Author 1, Author 2"
                const first = commaParts[0];
                const second = commaParts[1];
                
                // Heuristic: If both sides have multiple words, they are likely separate authors
                // e.g., "Nureni Olalekan Adeleke, Adebayo Mohammed Ojuolape"
                const firstWordCount = first.split(/\s+/).filter(w => w.length > 0).length;
                const secondWordCount = second.split(/\s+/).filter(w => w.length > 0).length;
                
                if (firstWordCount > 1 && secondWordCount > 1) {
                    result.push(first, second);
                } else {
                    // Likely "Surname, Given" or "Surname, Initials"
                    result.push(p);
                }
            } else {
                result.push(p);
            }
        } else {
            result.push(p);
        }
    });

    if (clean) {
        return result.map(a => a.replace(/[0-9*]/g, '').trim());
    }

    return result;
}
