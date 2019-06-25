\c
select article_id, title, author
from articles;

select comment_id, article_id, author
from comments;

SELECT article_id, count(comment_id) as comment_count
from comments
where article_id = 1
group by article_id;

SELECT articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.author, count(comments.comment_id) as comment_count
from articles
  left join comments on articles.article_id = comments.article_id
group by articles.article_id;

