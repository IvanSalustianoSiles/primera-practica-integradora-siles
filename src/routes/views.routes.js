import { Router } from "express";
import ProductManagerFS from "../dao/managers/productManager.fs.js";
import { uploader } from "../uploader.js";
let toSendObject = {};

const router = Router();

router.get("/welcome", (req, res) => {
  const user = {
    name: "Iván",
    surname: "Siles"
  }
  res.render('index', user);
});
router.get("/products", (req, res) => {

    toSendObject = { payload: ProductManagerFS.readFileAndSave() };
    res.render('home', toSendObject);
});
router.get("/realtimeproducts", (req, res) => {
  toSendObject = ProductManagerFS.readFileAndSave();
  res.render('realTimeProducts', {toSendObject: toSendObject});
});
router.post("/realtimeproducts", uploader.single("archivo"), (req, res) => {
  const socketServer = req.app.get("socketServer");  
  const {newProduct, productAction} = JSON.parse(req.body.json); 
  const {id} = newProduct;
  if (productAction == "add") {
    let toAddProduct = {...newProduct, thumbnail: req.file.filename, status: true};
    ProductManagerFS.addProduct(toAddProduct);
    let toAddId = ProductManagerFS.readFileAndSave()[ProductManagerFS.readFileAndSave().length-1]._id
    socketServer.emit("addConfirmed", {msg: "Producto agregado.", toAddId});
  } else if (productAction == "delete") {
    ProductManagerFS.deleteProductById(id);
    
    socketServer.emit("deleteConfirmed", {msg: `Producto de ID ${id} eliminado.`, pid: id});
  }
  res.render('realTimeProducts', {toSendObject: toSendObject});
});
router.get("/chat", (req, res) => {
  res.render("chat", {});
});
export default router;