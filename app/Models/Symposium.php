<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Symposium extends Model
{
    protected $fillable = [
        'editor_id', 'department_id', 'symposium_title', 'university_name',
        'symposium_details', 'aim_scope', 'mission', 'university_logo', 'cover_image', 'status'
    ];

    public function editor(): BelongsTo { return $this->belongsTo(User::class, 'editor_id'); }
    public function department(): BelongsTo { return $this->belongsTo(Department::class); }
    public function proceedings(): HasMany { return $this->hasMany(SymposiumProceeding::class); }
    public function committee(): HasMany { return $this->hasMany(SymposiumCommittee::class); }
}
