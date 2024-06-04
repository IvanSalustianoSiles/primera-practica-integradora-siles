class CartMDBManager {
    constructor(model) {
        this.carts = [];
        this.products = [];
        this.model = model;
    }

    createCartMDB = async () => {
        try {
            let toSendObject = await this.model.create({products: []});
            let toSendID = JSON.parse(JSON.stringify(toSendObject['_id']));
            return {msg: "Carrito creado en la base de datos.", ID: toSendID};
        } catch {
            return "Error al crear el carrito. Por favor, inténtalo de nuevo.";
        }
    };
    addProductMDB = async (pid, cid) => {
        let newProduct = {
            _id: pid,
            quantity: 1
        };
        if (!Object.values(newProduct).includes(undefined)) {
            let myCart = await this.model.findById(cid);
            if (myCart) {
              let myProduct = myCart["products"].find(product => product._id == pid);
              if (myProduct) {
                myProduct["quantity"] = myProduct["quantity"] + newProduct.quantity;
                await this.model.findOneAndUpdate({_id: cid, 'products._id': pid }, {$set: {'products.$.quantity': myProduct.quantity}});
                return `Ahora hay ${myProduct["quantity"]} productos de ID ${pid} en el carrito de ID ${cid}.`;
              } else {
                await this.model.findByIdAndUpdate({_id: cid}, {$set: {products: [...myCart.products, newProduct]}});
                let updatedCart = await this.model.findById(cid);
                return updatedCart;
              }
            } else {
              return `El carrito de ID ${cid} no fue encontrado.`;
            }
        } else {
            return `El producto que intentabas ingresar no contiene las propiedades adecuadas.`;
        };
    };
    getCartById = async (cid) => {
        try {
            let cartById = await this.model.findById(cid);
            return cartById;
        } catch (error) {
            return "Lo sentimos, ha ocurrido un error enviando la información que intentó capturar."
        }
    };
};
export default CartMDBManager;
