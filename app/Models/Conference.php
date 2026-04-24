<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
