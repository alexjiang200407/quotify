<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    /** @use HasFactory<\Database\Factories\QuoteFactory> */
    use HasFactory;
    
    protected $fillable = ["quote", "author_id"];
    protected $hidden = ['pivot', 'created_at', 'updated_at', 'author_id'];

    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function tags() {
        return $this->belongsToMany(Tag::class, 'quote_tags');
    }


    public function likes() {
        return $this->belongsToMany(User::class, 'quote_likes');
    }

    public function saves() {
        return $this->belongsToMany(User::class, 'quote_saves');
    }
}
