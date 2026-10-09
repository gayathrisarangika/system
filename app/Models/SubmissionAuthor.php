<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionAuthor extends Model
{
    protected $fillable = [
        'submission_id',
        'full_name',
        'email',
        'affiliation',
        'designation',
        'is_corresponding',
        'order',
    ];

    protected $casts = [
        'is_corresponding' => 'boolean',
        'order' => 'integer',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }
}
