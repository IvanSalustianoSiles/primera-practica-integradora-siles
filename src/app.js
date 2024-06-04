// Importaciones
import express from "express";
import mongoose from "mongoose";
import productRoutes from "./routes/products.routes.js";
import config from "./config.js";
import cartRoutes from "./routes/carts.routes.js";
import handlebars from "express-handlebars";
import viewRoutes from "./routes/views.routes.js";
import userRoutes from "./routes/users.routes.js";
import { initSocket } from "./sockets.js";


// Métodos a utilizar:

// Para productos:
// exampleProductManager.addProduct();
// exampleProductManager.getProducts();
// exampleProductManager.getProductById();
// exampleProductManager.deleteProductById();
// exampleProductManager.updateProduct();
// exampleProductManager.readFileAndSave();

// Para carritos:
// exampleCartManager.createCart();
// exampleCartManager.getProdsOfCartById();
// exampleCartManager.addProduct();
// exampleCartManager.updateFile();
// exampleCartManager.readFileAndSave();

const app = express();
const httpServer = app.listen(config.PORT, async () => {
  await mongoose.connect(config.MONGO_URL); // Lo manejamos con promesas, como hacíamos con Firebase en React.
  console.log(`Servidor activo en el puerto ${config.PORT}.`);
});
const socketServer = initSocket(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

app.use(viewRoutes);
app.use('/api/products/', productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/users", userRoutes);

app.use('/static', express.static(`${config.DIRNAME}/public`));
app.set("socketServer", socketServer);