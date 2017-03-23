import { Category } from "./category";
export var Product = (function () {
    function Product(id, price, name, imageUrl, imageUrls, description, category) {
        if (id === void 0) { id = 0; }
        if (price === void 0) { price = 0; }
        if (name === void 0) { name = ''; }
        if (imageUrl === void 0) { imageUrl = ''; }
        if (imageUrls === void 0) { imageUrls = []; }
        if (description === void 0) { description = ''; }
        if (category === void 0) { category = new Category(); }
        this.id = id;
        this.price = price;
        this.name = name;
        this.imageUrl = imageUrl;
        this.imageUrls = imageUrls;
        this.description = description;
        this.category = category;
    }
    return Product;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/shared/entity/product.js.map