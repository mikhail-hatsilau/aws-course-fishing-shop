insert into products_images (source, product_id, main)
values ($1, $2, $3)
returning id;