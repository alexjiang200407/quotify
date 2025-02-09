<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    /** @use HasFactory<\Database\Factories\AuthorFactory> */
    use HasFactory;

    protected $fillable = ["full_name", "description", "wiki_page"];
    protected $hidden = ['created_at', 'updated_at', 'signature_id'];

    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }

    public function signature()
    {
        return $this->belongsTo(Signature::class);
    }
}
