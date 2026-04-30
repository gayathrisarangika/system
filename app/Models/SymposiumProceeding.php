<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class SymposiumProceeding extends Model
{
    protected $fillable = ['symposium_id', 'year', 'version', 'pdf_link', 'cover_image'];

    protected function formatAssetPath($value)
    {
        if (!$value) return null;
        if (filter_var($value, FILTER_VALIDATE_URL)) return $value;
        $path = ltrim($value, '/');
        if (str_starts_with($path, 'storage/')) $path = substr($path, 8);
        return Storage::disk('public')->url($path);
    }

    protected function pdfLink(): Attribute
    {
        return Attribute::make(get: fn ($value) => $this->formatAssetPath($value));
    }

    protected function coverImage(): Attribute
    {
        return Attribute::make(get: fn ($value) => $this->formatAssetPath($value));
    }

    public function symposium(): BelongsTo { return $this->belongsTo(Symposium::class); }
}
