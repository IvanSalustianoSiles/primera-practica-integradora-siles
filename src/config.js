import * as url from 'url';

const config = {
    PORT: 8080,
    DIRNAME: url.fileURLToPath(new URL ('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img`},
    MONGO_URL: "mongodb+srv://silesivansalustiano:Coki2011@codercluster.n4kbrpc.mongodb.net/ecommerce"
}

export default config;