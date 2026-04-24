<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SymposiumCommittee extends Model
{
    protected $table = 'symposium_committee';
    protected $fillable = ['symposium_id', 'name', 'affiliation', 'role'];

    public function symposium(): BelongsTo { return $this->belongsTo(Symposium::class); }
}
