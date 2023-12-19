const Product = require("../models/ProductModel");
const Category = require("../models/Category");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, category, countInStock, price, description, discount } = newProduct;
    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "The name of product is existed!",
        });
      }
      const newProduct = await Product.create({
        name,
        image,
        category: category,
        countInStock: Number(countInStock),
        price,
        description,
        discount: Number(discount),
        rating: 0,
        selled: 0,
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined!",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined!",
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete product successfully!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete product successfully!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      }).populate("category");
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined!",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

function diacriticSensitiveRegex(string = "") {
  return string.toLowerCase()
    .replace(/a/g, "[a,á,à,ả,ã,ạ,ă,ắ,ằ,ẳ,ẵ,ặ,â,ấ,ầ,ẩ,ẫ,ậ]")
    .replace(/e/g, "[e,é,è,ẻ,ẽ,ẹ,ê,ế,ề,ể,ễ,ệ]")
    .replace(/i/g, "[i,í,ì,ỉ,ĩ,ị]")
    .replace(/o/g, "[o,ó,ò,ỏ,õ,ọ,ơ,ớ,ờ,ở,ỡ,ợ,ô,ố,ồ,ổ,ỗ,ộ]")
    .replace(/u/g, "[u,ú,ù,ủ,ũ,ụ,ư,ứ,ừ,ử,ữ,ự]")
}

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments().catch((error) => {
        throw new Error(`Error counting products: ${error.message}`);
      });
      let allProduct = [];
      if (filter) {
        const label = filter[0];
        if (label === "type" || label === "category") {
          const category = await Category.findOne({ slug: filter[1] });
          const allObjectFilter = await Product.find({ category: category._id })
            .limit(limit)
            .skip(page * limit)
            .sort({ createdAt: -1, updatedAt: -1 })
            .populate("category");
          resolve({
            status: "OK",
            message: "Success",
            data: allObjectFilter,
            total: totalProduct,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalProduct / limit),
          });
        }

        if (label === "name") {
          const allObjectFilter = await Product.find({
            [label]: { $regex: diacriticSensitiveRegex(filter[1]), $options: "i" },
          })
            .limit(limit)
            .skip(page * limit)
            .sort({ createdAt: -1, updatedAt: -1 })
            .populate("category");
          resolve({
            status: "OK",
            message: "Success",
            data: allObjectFilter,
            total: totalProduct,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalProduct / limit),
          });
        }
        const allObjectFilter = await Product.find({ [label]: { $regex: filter[1] } })
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 })
          .populate("category");
        resolve({
          status: "OK",
          message: "Success",
          data: allObjectFilter,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 })
          .populate("category");
        resolve({
          status: "OK",
          message: "Success",
          data: allProductSort,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      if (!limit) {
        allProduct = await Product.find()
          .sort({ createdAt: -1, updatedAt: -1 })
          .populate("category");
      } else {
        allProduct = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 })
          .populate("category");
      }
      resolve({
        status: "OK",
        message: "Success",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "Success",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
};
