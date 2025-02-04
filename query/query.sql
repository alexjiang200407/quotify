WITH cte AS (
    SELECT DISTINCT
        q.id,
        count(DISTINCT ql.id) AS upvotes,
        count(DISTINCT qs.id) AS saves,
        q.quote,
        JSON_OBJECT('id', a.id, 'full_name', a.full_name, 'description', a.description, 'wiki_page', a.wiki_page) as author,
        t.id as tag_id,
        t.label as tag_label,
        CASE
            WHEN EXISTS (
                SELECT 1 FROM quote_likes 
                WHERE quote_likes.quote_id = q.id AND quote_likes.user_id = 1
            ) THEN TRUE
            ELSE FALSE
        END AS user_upvoted
    FROM quotes AS q
    JOIN quote_tags AS qt ON qt.quote_id = q.id
    JOIN tags AS t ON qt.tag_id = t.id
    JOIN authors AS a ON q.author_id = a.id
    JOIN quote_likes AS ql ON q.id = ql.quote_id
    JOIN quote_saves AS qs ON q.id = qs.quote_id
    GROUP BY q.id, t.id
),
cte2 as (
    SELECT
        id,
        upvotes,
        saves,
        quote,
        author,
        JSON_ARRAYAGG(JSON_OBJECT('id', tag_id, 'label', tag_label)) OVER (PARTITION BY id) AS tags,
        user_upvoted
    FROM cte
)
SELECT JSON_ARRAYAGG(JSON_OBJECT(
    'id', id,
    'upvotes', upvotes,
    'saves', saves,
    'quote', quote,
    'author', author,
    'tags', tags,
    'user_upvoted', user_upvoted
))
FROM cte2
;