<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EditorialBoard extends Model
{
    protected $table = 'editorial_board';
    protected $fillable = ['journal_id', 'name', 'affiliation', 'role'];

    public function journal(): BelongsTo { return $this->belongsTo(Journal::class); }
}
