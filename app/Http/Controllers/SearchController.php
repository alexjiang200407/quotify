<?php

namespace App\Http\Controllers;
use App\Models\Author;
use App\Models\Quote;
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

        $searchResult = Quote::join('authors', 'authors.id', 'quotes.author_id')
            ->when(!empty($authors), function ($query) use ($author) {
                $query->where('quotes.author_id', '=', $author);
            })
            ->join('quote_tags', 'quote_tags.quote_id', '=', 'quotes.id')
            ->join('tags', 'tags.id', '=', 'quote_tags.tag_id')
            ->when(!empty($tags), function ($query) use ($tags) {
                $tag_count = count($tags);
                $query->whereIn('tags.id', $tags)
                    ->groupBy('quotes.id')
                    ->havingRaw("count(*) = $tag_count");
            })
            ->when($keyword, function ($query) use ($keyword) {
                $query->whereRaw("quotes.quote LIKE '%$keyword%' OR authors.full_name LIKE '%$keyword%'");
            })
            ->select("quotes.*")
            ->with(['author', 'tags'])
            ->withCount(['likes as upvotes', 'saves as saves'])
            ->orderByRaw('upvotes + saves DESC')
            ->paginate(10)
            ->appends(request()->query());
      
        return response()->json($searchResult);
    }

    public function searchAuthors(Request $request) {
        $data = $this->validateRequest($request, [
            "keyword" => "string|between:3,255",
        ]);

        $keyword = $data["keyword"];

        $searchResult = Author::whereLike('full_name', "%$keyword%")->get();
        return response()->json($searchResult);
    }
}