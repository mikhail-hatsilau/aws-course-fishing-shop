create table product_categories (
  id uuid default uuid_generate_v4(),
  title varchar(255) not null,
  parent_id uuid,
  primary key (id),
  foreign key (parent_id) references product_categories(id)
    on delete set null
);
