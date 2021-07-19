const ObjectId = require('mongoose').Types.ObjectId;
const Product = require('../models/Product');
const formatProductForClient = require('../libs/formatProductForClient');

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const subcategory = ctx.query.subcategory;
  if (subcategory) {
    const products = await Product.find({
      subcategory,
    });

    const productsFormatted = products.map((product) =>
      formatProductForClient(product)
    );

    ctx.body = {
      products: productsFormatted,
    };
  } else {
    await next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  const productsFormatted = products.map((product) =>
    formatProductForClient(product)
  );

  ctx.body = {
    products: productsFormatted,
  };
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  if (ObjectId.isValid(productId)) {
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      ctx.status = 404;
      return;
    }

    const productFormatted = formatProductForClient(product);

    ctx.body = {
      product: productFormatted,
    };
  } else {
    ctx.status = 400;
  }
};
