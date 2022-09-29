insert into products (title, description, price, category_id)
values ($1, $2, $3, $4)
returning id;
