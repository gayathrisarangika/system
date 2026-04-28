<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class ConferenceProceeding extends Model
{
    protected $fillable = ['conference_id', 'year', 'version', 'pdf_link', 'cover_image'];

    public function conference(): BelongsTo { return $this->belongsTo(Conference::class); }

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
