<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JournalSubmissionSetting extends Model
{
    protected $fillable = [
        'journal_id',
        'code',
        'is_open',
        'opening_datetime',
        'closing_datetime',
    ];

    protected $casts = [
        'is_open' => 'boolean',
        'opening_datetime' => 'datetime',
        'closing_datetime' => 'datetime',
    ];

    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

    /**
     * Determine if paper submission is currently open based on manual toggle and dates/times.
     */
    public function isCurrentlyOpen(): bool
    {
        if (!$this->is_open) {
            return false;
        }

        $now = now();

        if ($this->opening_datetime && $now->lt($this->opening_datetime)) {
            return false;
        }

        if ($this->closing_datetime && $now->gt($this->closing_datetime)) {
            return false;
        }

        return true;
    }
}
