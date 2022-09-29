create table products (
  id uuid default uuid_generate_v4(),
  title varchar(255) not null,
  description varchar(1000) not null,
  price integer,
  category_id uuid
  primary key (id),
  foreign key (category_id) references product_categories(id) on delete set null;
);
