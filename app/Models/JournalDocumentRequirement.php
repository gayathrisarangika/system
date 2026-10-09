<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JournalDocumentRequirement extends Model
{
    protected $fillable = [
        'journal_id',
        'document_type',
        'label',
        'is_required',
        'allowed_mimes',
        'max_size_mb',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'max_size_mb' => 'integer',
    ];

    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }
}
