import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
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
