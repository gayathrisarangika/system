<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConferenceProceeding extends Model
{
    protected $fillable = ['conference_id', 'year', 'version', 'pdf_link', 'cover_image'];

    public function conference(): BelongsTo { return $this->belongsTo(Conference::class); }
}
