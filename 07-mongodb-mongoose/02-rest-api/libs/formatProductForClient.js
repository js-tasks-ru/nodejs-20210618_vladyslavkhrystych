module.exports = (product) => ({
  id: product._id,
  title: product.title,
  price: product.price,
  images: product.images,
  category: product.category,
  description: product.description,
  subcategory: product.subcategory,
});
