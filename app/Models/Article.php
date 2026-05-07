<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    protected $fillable = [
        'issue_id', 'conference_proceeding_id', 'symposium_proceeding_id',
        'title', 'author', 'abstract', 'keywords', 'year',
        'doi', 'published_date', 'views', 'downloads', 'pages', 'pdf'
    ];

    protected function pdfUrl(): Attribute
    {
        return Attribute::get(fn () => $this->pdf ? Storage::disk('public')->url($this->pdf) : null);
    }

    protected $appends = ['pdf_url'];

    public function issue(): BelongsTo { return $this->belongsTo(Issue::class); }
    public function conferenceProceeding(): BelongsTo { return $this->belongsTo(ConferenceProceeding::class, 'conference_proceeding_id'); }
    public function symposiumProceeding(): BelongsTo { return $this->belongsTo(SymposiumProceeding::class, 'symposium_proceeding_id'); }
}
