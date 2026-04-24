<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConferenceCommittee extends Model
{
    protected $table = 'conference_committee';
    protected $fillable = ['conference_id', 'name', 'affiliation', 'role'];

    public function conference(): BelongsTo { return $this->belongsTo(Conference::class); }
}
