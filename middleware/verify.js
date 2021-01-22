const Database=require('../dataBase/index');
const DB = Database.sequelize();
const jsonWebToken=require('jsonwebtoken');
const myJWTSecretKey= 'adafrtw445!def_?gdf';
const cookieparser=require("cookie-parser");
var bodyParser = require('body-parser');
const ApiError=require('../error/api-error');

module.exports = {
    verifypass:(req,res,next)=>{
        const {MAIL,PASS}=req.body;
        //AND PASS='"+pass+"'
        DB.query("SELECT * FROM USERS_INFO WHERE CORREO='"+MAIL+"'" ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            console.log(resultado)
            console.log(resultado[0].PASSWORD)
            if (resultado[0]==undefined){
                res.status(403).json("Necesita registrarse para acceder");
            }
            else if(resultado[0].PASSWORD!==PASS){
                res.status(400).json("Mail y contraseña incorrectas");
            }
            else{
                next();
            }
        });
    },
    verifytoken: (req,res,next) =>{
        const {MAIL}=req.body;
        const cookietoken=req.cookies.token;
        const tokenDecodedData=jsonWebToken.verify(cookietoken,myJWTSecretKey);
        //const n = tokenDecodedData.includes("JsonWebTokenError: invalid token");
        //return res.json({tokenDecodedData});
        if(tokenDecodedData.MAIL==MAIL){
            next();
            //res.json(tokenDecodedData.MAIL)
        }
        else{
            res.status(401).json("Su sesión ha caducado, por favor inicie sesión nuevamente");
        }
    },
    verifyuser: (req,res,next) => {
        const {USER, NOMBRE_APELLIDO, MAIL, TELEFONO, DIRECCION, ADMIN}=req.body;
        DB.query("SELECT * FROM USERS_INFO WHERE USUARIO='"+USER+"'"  ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            if (resultado[0]==undefined){
                next();
            }
            else if(resultado[0].USUARIO==USER){
                res.status(400).json("Ya existe este usuario, por favor ingrese otro");
            }
            else{
            }
        });
},
    verifymail: (req,res,next) => {
        const {USER, NOMBRE_APELLIDO, MAIL, TELEFONO, DIRECCION, ADMIN}=req.body;
        DB.query("SELECT * FROM USERS_INFO WHERE CORREO='"+MAIL+"'"  ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            if (resultado[0]==undefined){
                next();
            }
            else if(resultado[0].CORREO==MAIL){
                res.status(400).json("Ya existe un usuario asociado a ese mail, por favor ingrese otro");
            }
            else{
            }
        });
},
    verifyproduct: (req,res,next) => {
        const {NAME_PRODUCT, PRICE_PRODUCT, IMAGE_PRODUCT,MAIL}=req.body;
        DB.query("SELECT * FROM PRODUCTS_INFO WHERE NAME_PRODUCT='"+NAME_PRODUCT+"'"  ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            if (resultado[0]==undefined){
                next();
            }
            else if(resultado[0].NAME_PRODUCT==NAME_PRODUCT){
                res.status(409).json("Ya existe un producto con este nombre, por favor ingrese otro");
            }
            else{
            }
        });
},
    verifyproducttochange: (req,res,next) => {
        const {ID,NAME_PRODUCT, PRICE_PRODUCT, IMAGE_PRODUCT,MAIL}=req.body;
        DB.query("SELECT * FROM PRODUCTS_INFO WHERE ID="+ID+""  ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            if (resultado[0]==undefined){
                res.status(409).json("No existe un producto con este ID, por favor ingrese otro");
            }
            else if(resultado[0].ID==ID){
                next();
            }
            else{
            }
        });
    },
    verifyordertochange: (req,res,next) => {
        const {NUMERO}=req.body;
        DB.query("SELECT * FROM ORDERS_INFO WHERE NUMERO="+NUMERO+""  ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            if (resultado[0]==undefined){
                res.status(409).json("No existe una orden con este número, por favor ingrese otro");
            }
            else if(resultado[0].NUMERO==NUMERO){
                next();
            }
            else{
            }
        });
    },
    statusorder: (req,res,next) => {
        const {ESTADO,NUMERO,MAIL}=req.body;
        DB.query('SELECT ESTADO FROM ORDERS_INFO WHERE NUMERO='+ NUMERO ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            if(resultado[0].ESTADO=='NUEVO'){
                res.status(409).json("No puede cambiarse el estado de la orden hasta que el usuario no la confirme");
            }
            else{
                next();
            }
        });
},
    useradmin: (req,res,next) => {
        const admn = req.query.admn;
        const MAIL=req.body;
        DB.query("SELECT ADMIN FROM USERS_INFO WHERE USUARIO='"+admn+"'"  ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            if(resultado[0].ADMIN==1){
                next();
            }
            else{
                res.status(403).json("El usuario no tiene permisos para realizar esta acción");
            }
        });
    },
    addproducttoorder: (req,res,next)=>{
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var horario= h+ ':' +m+ ':'+s;
        const cookie=req.cookies.orden;
        const {DESCRIPCION,PAGO_TIPO,PAGO_MONTO,USUARIO,DIRECCION,MAIL}=req.body;
        //res.cookie('orden',"confirmada");
    if (cookie=='nueva'){
            DB.query("UPDATE ORDERS_INFO SET DESCRIPCION=CONCAT(DESCRIPCION , '" + DESCRIPCION+"'),PAGO_MONTO= PAGO_MONTO +" +PAGO_MONTO+", HORA= '" +horario+ "' WHERE USUARIO= '"+USUARIO+"'AND ESTADO='NUEVO'" ,{
                type:DB.QueryTypes.UPDATE
            }).then((resultado) => {
                res.json("El producto fue agregado a la orden");
            })
        }
        else{
            next();
        }
},

}