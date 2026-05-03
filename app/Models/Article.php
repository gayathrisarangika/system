<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    protected $fillable = [
        'issue_id', 'title', 'author', 'abstract', 'keywords', 'pdf', 'year',
        'doi', 'published_date', 'views', 'downloads', 'pages'
    ];

    protected function formatAssetPath($value)
    {
        if (!$value) return null;
        if (filter_var($value, FILTER_VALIDATE_URL)) return $value;
        $path = ltrim($value, '/');
        if (str_starts_with($path, 'storage/')) $path = substr($path, 8);
        return Storage::disk('public')->url($path);
    }

    protected function pdf(): Attribute
    {
        return Attribute::make(get: fn ($value) => $this->formatAssetPath($value));
    }

    public function issue(): BelongsTo { return $this->belongsTo(Issue::class); }
}
