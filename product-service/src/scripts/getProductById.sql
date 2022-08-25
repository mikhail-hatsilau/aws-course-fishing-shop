select products.*, stock.count, products_images.id as image_id, products_images."source" as image_source, products_images.main as main_image 
from products inner join stock on products.id = stock.product_id
inner join products_images on products.id = products_images.product_id 
where stock.count > 0 and products.id = $1;
