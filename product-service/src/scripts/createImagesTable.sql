create table products_images (
  id uuid default uuid_generate_v4(),
  source varchar(255) not null,
  product_id uuid,
  main boolean default false not null,
  foreign key (product_id) references products(id) on delete set null
);
