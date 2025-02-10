<?php

namespace App\Http\Controllers;
use App\Models\Author;
use App\Models\Quote;
use App\Models\Tag;
use DB;
use \Illuminate\Http\Request;

class SearchController extends Controller
{
    public function searchQuotes(Request $request) {
        $data = $this->validateRequest($request, [
            "tags" => "array|max:4",
            "tags.*" => "numeric|distinct",
            "author" => "numeric|distinct",
            "keyword" => "string|between:3,255",
        ]);

        // TODO add caching

        $author = $data['author'] ?? null;
        $tags = $data['tags'] ?? [];
        $keyword = $data['keyword'] ?? null;

        if (!$tags && !$author && $keyword == "") {
            return response()->json(["error" => "Search query must include at least one tag, author, or keyword"], 400);
        } 
      
        return response()->json($this->searchQuery($author, $tags, $keyword, null)
            ->paginate(10)
            ->appends(request()->query())
        );
    }

    public function searchQuotesAuth(Request $request) {
        $data = $this->validateRequest($request, [
            "tags" => "array|max:4",
            "tags.*" => "numeric|distinct",
            "author" => "numeric|distinct",
            "keyword" => "string|between:3,255",
        ]);

        // TODO add caching

        $author = $data['author'] ?? null;
        $tags = $data['tags'] ?? [];
        $keyword = $data['keyword'] ?? null;

        if (!$tags && !$author && $keyword == "") {
            return response()->json(["error" => "Search query must include at least one tag, author, or keyword"], 400);
        } 
        
        $page = $this->searchQuery($author, $tags, $keyword, $this->getUser($request)->id)
            ->paginate(10)->appends(request()->query());
        return response()->json(
            $page
        );
    }

    public function searchAuthors(Request $request) {
        $data = $this->validateRequest($request, [
            "keyword" => "string|between:3,255",
        ]);

        $keyword = $data["keyword"];

        $searchResult = Author::whereLike('full_name', "%$keyword%")->get();
        return response()->json($searchResult);
    }

    public function searchQuery(string|null $author, array|null $tags, string|null $keyword, string|null $user) {
        $user = $user ? $user : '-1';
        return Quote::join('authors', 'authors.id', 'quotes.author_id')
        ->leftJoin('quote_tags', 'quote_tags.quote_id', '=', 'quotes.id')
        ->leftJoin('tags', 'tags.id', '=', 'quote_tags.tag_id')
        ->when(!empty($tags), function ($query) use ($tags) {
            $tag_count = count($tags);
            $query->whereIn('tags.id', $tags)
            ->groupBy('quotes.id')
            ->havingRaw("count(*) = $tag_count");
        })
        ->when(!empty($author), function ($query) use ($author) {
            $query->where('quotes.author_id', '=', $author);
        })
        ->when($keyword, function ($query) use ($keyword) {
            $query->whereRaw("quotes.quote LIKE '%$keyword%' OR authors.full_name LIKE '%$keyword%'");
        })
        ->groupBy('quotes.id')
        ->selectRaw("
            quotes.*,
            CASE
                WHEN EXISTS (
                    SELECT 1 FROM quote_likes 
                    WHERE quote_likes.quote_id = quotes.id AND quote_likes.user_id = $user
                ) THEN TRUE
                ELSE FALSE
            END AS user_upvoted,
            CASE
                WHEN EXISTS (
                    SELECT 1 FROM quote_saves 
                    WHERE quote_saves.quote_id = quotes.id AND quote_saves.user_id = $user
                ) THEN TRUE
                ELSE FALSE
            END AS user_saved
        ")
        ->with(['author', 'tags', 'author.signature'])
        ->withCount(['likes as upvotes', 'saves as saves']);
    }


    public function getTopics() {
        $authors = DB::table("authors")->selectRaw("
            authors.id as id, authors.full_name as label, 'author' as type, count(quote_likes.id) + count(quote_saves.id) as popularity
        ")
        ->leftJoin('quotes', 'quotes.author_id', '=', 'authors.id')
        ->leftJoin('quote_likes', 'quote_likes.quote_id', '=', 'quotes.id')
        ->leftJoin('quote_saves', 'quote_saves.quote_id', '=', 'quotes.id')
        ->groupBy('id')
        ->orderByDesc('popularity');

        
        $tags = Tag::selectRaw("
            tags.id as id, tags.label, 'tag' as type, count(quote_likes.id) + count(quote_saves.id) as popularity
        ")
        ->leftJoin('quote_tags', 'quote_tags.tag_id', '=', 'tags.id')
        ->leftJoin('quotes', 'quotes.id', '=', 'quote_tags.tag_id')
        ->leftJoin('quote_likes', 'quote_likes.quote_id', '=', 'quotes.id')
        ->leftJoin('quote_saves', 'quote_saves.quote_id', '=', 'quotes.id')
        ->groupBy('id')
        ->orderByDesc('popularity')
        ->unionAll($authors)
        ->get();

        
        return response()->json($tags);
    }

}