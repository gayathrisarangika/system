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
        'journal_id', 'volume', 'issue', 'year', 'is_current_issue',
        'published_date'
    ];

    public function journal(): BelongsTo { return $this->belongsTo(Journal::class); }
    public function articles(): HasMany { return $this->hasMany(Article::class); }
}
