const express=require("express");
const apiErrorHandler = require("./error/api-error-handler");
const router=require('./routes');
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./swagger.json");

const app=express();
app.use(express.json());
app.use("/", router);
app.use(apiErrorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(4444,()=>console.log("Servidor escuchando en puerto 4444"));
