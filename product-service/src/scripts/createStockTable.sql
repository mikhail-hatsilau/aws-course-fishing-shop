create table stock (
  id uuid default uuid_generate_v4(),
  product_id uuid,
  count integer not null,
  primary key (id),
  foreign key (product_id) references products(id) on delete cascade
)
