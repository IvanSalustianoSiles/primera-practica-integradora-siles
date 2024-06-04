import { Router } from "express";
import { uploader } from "../uploader.js";
import { productsModel } from "../dao/models/products.model.js";
import ProductManagerFS from "../dao/managers/productManager.fs.js";
import ProductMDBManager from "../dao/productManager.mdb.js";

let toSendObject = {};  
const router = Router();
const productsCollection = new ProductMDBManager(productsModel);

router.get("/", async (req, res) => {
  toSendObject = await productsCollection.getAllProducts(req.query.limit, req.query.page, req.query.query, req.query.sort, req.query.available, "/api/products");
  res.send(toSendObject);
});
router.get("/:pid", async (req, res) => {
  toSendObject = await productsCollection.getProductById(req.params.pid);
  res.send(toSendObject);
});
router.post("/", uploader.single("thumbnail"), async (req, res) => {
  toSendObject = await productsCollection.addProducts({...req.body, thumbnail: req.file.filename, status: true});
  let addedProduct = toSendObject.find(product => product.title = req.body.title);
  let pid = JSON.parse(JSON.stringify(addedProduct._id)).replace(/"/g, "");
  ProductManagerFS.addProduct({...req.body, thumbnail: req.file.filename, status: true, mdbid: pid});
  res.send(toSendObject);
});
router.put("/:pid", async (req, res) => {
  const {pid} = req.params;
  toSendObject = await productsCollection.updateProductById(pid, req.body);
  ProductManagerFS.updateProduct(pid, req.body); 
  res.send(toSendObject);
});
router.delete("/:pid", async (req, res) => {
  const {pid} = req.params;
  toSendObject = await productsCollection.deleteProductById(pid);
  ProductManagerFS.deleteProductById(pid);
  res.send(toSendObject);
});

export default router;
