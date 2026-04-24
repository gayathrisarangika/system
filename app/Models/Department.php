<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = ['name'];

    public function journals(): HasMany { return $this->hasMany(Journal::class); }
    public function conferences(): HasMany { return $this->hasMany(Conference::class); }
    public function symposiums(): HasMany { return $this->hasMany(Symposium::class); }
    public function users(): HasMany { return $this->hasMany(User::class); }
}
