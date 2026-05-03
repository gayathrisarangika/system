<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    protected $fillable = [
        'issue_id', 'title', 'author', 'abstract', 'keywords', 'year',
        'doi', 'published_date', 'views', 'downloads', 'pages'
    ];

    public function issue(): BelongsTo { return $this->belongsTo(Issue::class); }
}
