// this is the entry point of our server , server will starts from here 
import  connectDB  from "./db/index.js";
import app from "./app.js";

connectDB()
.then(() => {
    app.listen(`${process.env.PORT || 8000}`, () => {
        `server is listening on port: ${process.env.PORT}`
    })
})
.catch((err) => {
    console.log(`Error connecting server`);
    throw err;
})


