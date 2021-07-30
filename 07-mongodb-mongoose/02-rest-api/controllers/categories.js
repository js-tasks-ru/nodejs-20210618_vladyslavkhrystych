const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  const categoriesFormatted = categories.map((category) => {
    const categoryFormatted = {
      id: category._id,
      title: category.title,
    };

    if (category.subcategories) {
      categoryFormatted.subcategories = category.subcategories.map(
        (subcategory) => ({
          id: subcategory._id,
          title: subcategory.title,
        })
      );
    }

    return categoryFormatted;
  });

  ctx.body = {
    categories: categoriesFormatted,
  };

  next();
};
