import { Router } from "express";
import { cartsModel } from "../dao/models/carts.model.js";
import CartManagerFS from "../dao/managers/cartManager.fs.js";
import CartMDBManager from "../dao/cartManager.mdb.js";
let toSendObject = {};
const router = Router();
const cartsCollection = new CartMDBManager(cartsModel);

router.get("/", async (req, res) => {
  try {
      const cart = await cartsModel.find().lean();
      res.send({status: 1, payload: cart});
  } catch {
     res.send({status: 0, payload: "Lo sentimos, ha ocurrido un error al intentar recibir el carrito."})
  }
});
router.post("/", async (req, res) => {
  toSendObject = await cartsCollection.createCartMDB();
  CartManagerFS.createCart(toSendObject.ID);
  res.status(200).send(toSendObject);
});
router.get("/:cid", async (req, res) => {
  const {cid} = req.params;
  toSendObject = await cartsCollection.getCartById(cid);
  res.status(200).send(toSendObject);
});
router.post("/:cid/product/:pid", async (req, res) => {
  const {pid, cid} = req.params;
  CartManagerFS.addProduct(pid, cid);
  toSendObject = await cartsCollection.addProductMDB(pid, cid);
  res.status(200).send(toSendObject);
});

export default router;