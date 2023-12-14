const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim : true },
        slug: { type: String, unique: true, slug:"name"},
    },
    {
        timestamps: true,
    }
);
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;