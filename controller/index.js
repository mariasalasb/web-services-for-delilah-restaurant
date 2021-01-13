const Database=require('../dataBase/index');
const DB = Database.sequelize();
const jsonWebToken=require('jsonwebtoken');
const myJWTSecretKey= 'adafrtw445!def_?gdf';
const cookieparser=require("cookie-parser");
var bodyParser = require('body-parser');

module.exports = {
    login: (req,res)=>{
        const {MAIL,PASS}=req.body;
        //const payload={mail,pass};
        const token=jsonWebToken.sign(req.body,myJWTSecretKey);
        res.cookie('token',token);
        res.json("Log in exitoso");
    },
    logout: (req,res)=>{
        res.clearCookie("token");
        res.clearCookie("orden");
        res.json("Sesión finalizada");
    },
    createorder:(req,res)=>{
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var horario= h+ ':' +m+ ':'+s;
        const {DESCRIPCION,PAGO_TIPO,PAGO_MONTO,USUARIO,DIRECCION,MAIL}=req.body;
        DB.query("INSERT INTO ORDERS_INFO (ESTADO,HORA,DESCRIPCION,PAGO_TIPO,PAGO_MONTO,USUARIO,DIRECCION) VALUES ('NUEVO', '"+horario+"', '"+DESCRIPCION+"','"+PAGO_TIPO+"', '"+PAGO_MONTO+"','"+USUARIO+"','"+DIRECCION+"')",{
            type:DB.QueryTypes.INSERT
        }) .then((resultado) => {
            res.json("Orden creada con éxito");
        });
        res.cookie('orden',"nueva");
},
    confirmorder:(req,res)=>{
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var horario= h+ ':' +m+ ':'+s;
        const {DESCRIPCION,PAGO_TIPO,PAGO_MONTO,USUARIO,DIRECCION,MAIL}=req.body;
        DB.query("UPDATE ORDERS_INFO SET ESTADO='CONFIRMADO', HORA= '" +horario+ "' WHERE USUARIO= '"+USUARIO+"'AND ESTADO='NUEVO'"  ,{
            type:DB.QueryTypes.UPDATE
        }).then((resultado) => {
            res.json("Orden confirmada con exito");
        });
        res.cookie('orden',"confirmada");
},
    adduser: (req,res) => {
        const {USER, NOMBRE_APELLIDO, MAIL, TELEFONO, DIRECCION,PASS}=req.body;
        DB.query("INSERT INTO USERS_INFO (USUARIO, NOMBRE_APELLIDO, CORREO, TELEFONO, DIRECCION, ADMIN,PASSWORD) VALUES ('"+USER+"', '"+NOMBRE_APELLIDO+"', '"+MAIL+"','"+TELEFONO+"', '"+DIRECCION+"', '0', '"+PASS+"')",{
            type:DB.QueryTypes.INSERT
        }) .then((resultado) => {
            res.json("Usuario agregado con exito");
        });
},
    addproducttoresto: (req,res) => {
        const {NAME_PRODUCT, PRICE_PRODUCT, IMAGE_PRODUCT,MAIL}=req.body;
        DB.query("INSERT INTO PRODUCTS_INFO (NAME_PRODUCT, PRICE_PRODUCT, IMAGE_PRODUCT) VALUES ('"+NAME_PRODUCT+"', '"+PRICE_PRODUCT+"', '"+IMAGE_PRODUCT+"')",{
            type:DB.QueryTypes.INSERT
        }) .then((resultado) => {
            res.json("Producto creado con exito");
        });
},
    editproducttoresto: (req,res) => {
        const {ID,NAME_PRODUCT, PRICE_PRODUCT, IMAGE_PRODUCT,MAIL}=req.body;
        DB.query("UPDATE PRODUCTS_INFO SET NAME_PRODUCT='"+NAME_PRODUCT+"',PRICE_PRODUCT="+PRICE_PRODUCT+", IMAGE_PRODUCT='"+IMAGE_PRODUCT+"'WHERE ID="+ID,{
            type:DB.QueryTypes.UPDATE
        }) .then((resultado) => {
            res.json("Producto actualizado con exito");
        });
    },
    eliminateproducttoresto: (req,res) => {
        const {ID,MAIL}=req.body;
        DB.query("DELETE FROM PRODUCTS_INFO WHERE ID="+ID+"",{
            type:DB.QueryTypes.DELETE
        }) .then((resultado) => {
            res.json("Producto eliminado con exito");
        });
    },
    updateorderstatus:(req,res)=>{
        const {ESTADO,NUMERO,MAIL}=req.body;
        DB.query("UPDATE ORDERS_INFO SET ESTADO='" +ESTADO+ "'  WHERE NUMERO= '"+NUMERO+"'"  ,{
            type:DB.QueryTypes.UPDATE
        }).then((resultado) => {
            res.json("Estado de la orden actualizado a: "+ ESTADO);
        });
    },
    productlist: (req,res) => {
        //const MAIL=req.body;
        DB.query('SELECT * FROM PRODUCTS_INFO',{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            res.json(resultado);
        });
    },
    orderlist: (req,res) => {
        const MAIL=req.body;
        DB.query('SELECT * FROM ORDERS_INFO',{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            res.json(resultado);
        });
},
    order: (req,res) => {
        //const numero = req.query.numero;
        const {MAIL,NUMERO}=req.body;
        DB.query('SELECT ESTADO,DESCRIPCION,PAGO_MONTO,PAGO_TIPO, DIRECCION FROM ORDERS_INFO WHERE NUMERO='+ NUMERO ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            res.json(resultado);
        });
},
    cancelorder: (req,res) => {
        //const numero = req.query.numero;
        const {MAIL,NUMERO}=req.body;
        DB.query('UPDATE ORDERS_INFO SET ESTADO="CANCELADO" WHERE NUMERO='+ NUMERO ,{
            type:DB.QueryTypes.UPDATE
        }).then((resultado) => {
            res.json("La orden número "+ NUMERO + " ha sido cancelada");
        });
},
    call: (req,res) => {
        //const usuario = req.query.usuario;
        const {MAIL,USUARIO}=req.body;
        DB.query("SELECT TELEFONO FROM USERS_INFO WHERE USUARIO='"+USUARIO+"'"  ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            const tel=JSON.stringify(resultado);
            res.send(`El teléfono del usuario es <a href=tel:  ${resultado[0].TELEFONO} > ${resultado[0].TELEFONO} </a>`);
        });
},

}