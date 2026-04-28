<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Journal extends Model
{
    protected $fillable = [
        'editor_id', 'department_id', 'journal_title', 'university_name',
        'journal_details', 'aim_scope', 'mission', 'university_logo', 'cover_image', 'status',
        'issn', 'online_issn', 'for_authors', 'for_reviewers', 'editorial_policies', 'contact_us'
    ];

    public function editor(): BelongsTo { return $this->belongsTo(User::class, 'editor_id'); }
    public function department(): BelongsTo { return $this->belongsTo(Department::class); }
    public function issues(): HasMany { return $this->hasMany(Issue::class); }
    public function editorialBoard(): HasMany { return $this->hasMany(EditorialBoard::class); }
}
