<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Journal extends Model
{
    protected $fillable = [
        'editor_id', 'department_id', 'journal_title', 'university_name',
        'journal_details', 'aim_scope', 'mission', 'university_logo', 'cover_image', 'status',
        'issn', 'online_issn', 'for_authors', 'for_reviewers', 'editorial_policies', 'contact_us'
    ];

    protected function formatAssetPath($value)
    {
        if (!$value) return null;
        if (filter_var($value, FILTER_VALIDATE_URL)) return $value;

        $path = ltrim($value, '/');
        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, 8);
        }

        return Storage::disk('public')->url($path);
    }

    protected function universityLogo(): Attribute
    {
        return Attribute::make(get: fn ($value) => $this->formatAssetPath($value));
    }

    protected function coverImage(): Attribute
    {
        return Attribute::make(get: fn ($value) => $this->formatAssetPath($value));
    }

    protected function forAuthors(): Attribute
    {
        return Attribute::make(get: fn ($value) => $this->formatAssetPath($value));
    }

    protected function forReviewers(): Attribute
    {
        return Attribute::make(get: fn ($value) => $this->formatAssetPath($value));
    }

    protected function editorialPolicies(): Attribute
    {
        return Attribute::make(get: fn ($value) => $this->formatAssetPath($value));
    }

    public function editor(): BelongsTo { return $this->belongsTo(User::class, 'editor_id'); }
    public function department(): BelongsTo { return $this->belongsTo(Department::class); }
    public function issues(): HasMany { return $this->hasMany(Issue::class); }
    public function editorialBoard(): HasMany { return $this->hasMany(EditorialBoard::class); }
}
