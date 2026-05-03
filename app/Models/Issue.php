<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Issue extends Model
{
    protected $fillable = [
        'journal_id', 'volume', 'issue', 'year', 'cover_image', 'pdf_link', 'is_current_issue',
        'published_date'
    ];

    protected function formatAssetPath($value)
    {
        if (!$value) return null;
        if (filter_var($value, FILTER_VALIDATE_URL)) return $value;
        $path = ltrim($value, '/');
        if (str_starts_with($path, 'storage/')) $path = substr($path, 8);
        return Storage::disk('public')->url($path);
    }

    protected function coverImage(): Attribute
    {
        return Attribute::make(get: fn ($value) => $this->formatAssetPath($value));
    }

    protected function pdfLink(): Attribute
    {
        return Attribute::make(get: fn ($value) => $this->formatAssetPath($value));
    }

    public function journal(): BelongsTo { return $this->belongsTo(Journal::class); }
    public function articles(): HasMany { return $this->hasMany(Article::class); }
}
