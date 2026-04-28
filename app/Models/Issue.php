<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Issue extends Model
{
    protected $fillable = [
        'journal_id', 'volume', 'issue', 'year', 'cover_image', 'pdf_link', 'is_current_issue',
        'published_date'
    ];

    public function journal(): BelongsTo { return $this->belongsTo(Journal::class); }
    public function articles(): HasMany { return $this->hasMany(Article::class); }

    protected function coverImage(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? (str_starts_with($value, 'http') ? $value : (str_starts_with(ltrim($value, '/'), 'storage/') ? '/'.ltrim($value, '/') : '/storage/'.$value)) : null,
        );
    }

    protected function pdfLink(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? (str_starts_with($value, 'http') ? $value : (str_starts_with(ltrim($value, '/'), 'storage/') ? '/'.ltrim($value, '/') : '/storage/'.$value)) : null,
        );
    }
}
