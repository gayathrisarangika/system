<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Symposium extends Model
{
    protected $table = 'symposiums';

    protected $fillable = [
        'editor_id', 'department_id', 'symposium_title', 'university_name',
        'symposium_details', 'aim_scope', 'mission', 'status',
        'issn', 'online_issn', 'contact_us', 'university_logo', 'cover_image',
        'for_authors', 'for_reviewers', 'editorial_policies'
    ];

    protected function coverImageUrl(): Attribute
    {
        return Attribute::get(fn () => $this->cover_image ? Storage::disk('public')->url($this->cover_image) : null);
    }

    protected function universityLogoUrl(): Attribute
    {
        return Attribute::get(fn () => $this->university_logo ? Storage::disk('public')->url($this->university_logo) : null);
    }

    protected function forAuthorsUrl(): Attribute
    {
        return Attribute::get(fn () => $this->for_authors ? Storage::disk('public')->url($this->for_authors) : null);
    }

    protected function forReviewersUrl(): Attribute
    {
        return Attribute::get(fn () => $this->for_reviewers ? Storage::disk('public')->url($this->for_reviewers) : null);
    }

    protected function editorialPoliciesUrl(): Attribute
    {
        return Attribute::get(fn () => $this->editorial_policies ? Storage::disk('public')->url($this->editorial_policies) : null);
    }

    protected $appends = ['cover_image_url', 'university_logo_url', 'for_authors_url', 'for_reviewers_url', 'editorial_policies_url'];

    public function editor(): BelongsTo { return $this->belongsTo(User::class, 'editor_id'); }
    public function department(): BelongsTo { return $this->belongsTo(Department::class)->withDefault(); }
    public function proceedings(): HasMany { return $this->hasMany(SymposiumProceeding::class); }
    public function committee(): HasMany { return $this->hasMany(SymposiumCommittee::class); }
}
