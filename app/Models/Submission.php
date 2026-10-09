<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Submission extends Model
{
    protected $fillable = [
        'paper_id',
        'journal_id',
        'user_id',
        'title',
        'abstract',
        'keywords',
        'status',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function authors(): HasMany
    {
        return $this->hasMany(SubmissionAuthor::class)->orderBy('order', 'asc');
    }

    public function files(): HasMany
    {
        return $this->hasMany(SubmissionFile::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(SubmissionStatusHistory::class)->orderBy('created_at', 'asc');
    }

    public function correspondingAuthor()
    {
        return $this->authors()->where('is_corresponding', true)->first() 
            ?? $this->authors()->first();
    }
}
