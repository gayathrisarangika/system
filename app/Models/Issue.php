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
        'published_date', 'cover_image', 'pdf_link'
    ];

    protected function coverImageUrl(): Attribute
    {
        return Attribute::get(fn () => $this->cover_image ? Storage::disk('public')->url($this->cover_image) : null);
    }

    protected function pdfUrl(): Attribute
    {
        return Attribute::get(fn () => $this->pdf_link ? Storage::disk('public')->url($this->pdf_link) : null);
    }

    protected function pdfLinkUrl(): Attribute
    {
        return Attribute::get(fn () => $this->pdf_link ? Storage::disk('public')->url($this->pdf_link) : null);
    }

    protected $appends = ['cover_image_url', 'pdf_url', 'pdf_link_url'];

    public function journal(): BelongsTo { return $this->belongsTo(Journal::class); }
    public function articles(): HasMany { return $this->hasMany(Article::class); }
}
