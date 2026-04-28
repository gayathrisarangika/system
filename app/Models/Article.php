<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Article extends Model
{
    protected $fillable = [
        'issue_id', 'title', 'author', 'abstract', 'keywords', 'pdf', 'year',
        'doi', 'published_date', 'views', 'downloads', 'pages'
    ];

    public function issue(): BelongsTo { return $this->belongsTo(Issue::class); }

    protected function pdf(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? (str_starts_with($value, 'http') ? $value : (str_starts_with(ltrim($value, '/'), 'storage/') ? '/'.ltrim($value, '/') : '/storage/'.$value)) : null,
        );
    }
}
