<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SymposiumProceeding extends Model
{
    protected $fillable = ['symposium_id', 'year', 'version', 'pdf_link', 'cover_image'];

    public function symposium(): BelongsTo { return $this->belongsTo(Symposium::class); }
}
