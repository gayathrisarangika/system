<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Conference extends Model
{
    protected $fillable = [
        'editor_id', 'department_id', 'conference_title', 'university_name',
        'conference_details', 'aim_scope', 'mission', 'university_logo', 'cover_image', 'status'
    ];

    protected function formatAssetPath($value)
    {
        if (!$value) return null;
        if (filter_var($value, FILTER_VALIDATE_URL)) return $value;
        $path = ltrim($value, '/');
        if (str_starts_with($path, 'storage/')) $path = substr($path, 8);
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

    public function editor(): BelongsTo { return $this->belongsTo(User::class, 'editor_id'); }
    public function department(): BelongsTo { return $this->belongsTo(Department::class); }
    public function proceedings(): HasMany { return $this->hasMany(ConferenceProceeding::class); }
    public function committee(): HasMany { return $this->hasMany(ConferenceCommittee::class); }
}
