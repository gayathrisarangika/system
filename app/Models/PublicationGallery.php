<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class PublicationGallery extends Model
{
    protected $fillable = ['publication_id', 'publication_type', 'image_path', 'caption'];

    protected function imageUrl(): Attribute
    {
        return Attribute::get(fn () => $this->image_path ? Storage::disk('public')->url($this->image_path) : null);
    }

    protected $appends = ['image_url'];

    public function publication(): MorphTo
    {
        return $this->morphTo();
    }
}
