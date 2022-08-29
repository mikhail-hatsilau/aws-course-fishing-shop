insert into stock (product_id, count)
values ($1, $2)
returning id;
