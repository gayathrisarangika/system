<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Conference extends Model
{
    protected $fillable = [
        'editor_id', 'department_id', 'conference_title', 'university_name',
        'conference_details', 'aim_scope', 'mission', 'university_logo', 'cover_image', 'status'
    ];

    public function editor(): BelongsTo { return $this->belongsTo(User::class, 'editor_id'); }
    public function department(): BelongsTo { return $this->belongsTo(Department::class); }
    public function proceedings(): HasMany { return $this->hasMany(ConferenceProceeding::class); }
    public function committee(): HasMany { return $this->hasMany(ConferenceCommittee::class); }

    protected function universityLogo(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? (str_starts_with($value, 'http') ? $value : (str_starts_with(ltrim($value, '/'), 'storage/') ? '/'.ltrim($value, '/') : '/storage/'.$value)) : null,
        );
    }

    protected function coverImage(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? (str_starts_with($value, 'http') ? $value : (str_starts_with(ltrim($value, '/'), 'storage/') ? '/'.ltrim($value, '/') : '/storage/'.$value)) : null,
        );
    }
}
