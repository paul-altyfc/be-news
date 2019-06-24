\c
select *
from articles;

insert into articles
  (title,body,votes,topic,author,created_at)
VALUES
  ('Test', 'Test insert', 0, 'coding', 'tickle122', '2017-06-04 21:06:53-00');