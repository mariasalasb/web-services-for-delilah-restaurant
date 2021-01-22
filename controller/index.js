const Database=require('../dataBase/index');
const DB = Database.sequelize();
const jsonWebToken=require('jsonwebtoken');
const myJWTSecretKey= 'adafrtw445!def_?gdf';
const cookieparser=require("cookie-parser");
var bodyParser = require('body-parser');

module.exports = {
    login: (req,res)=>{
        const {MAIL,PASS}=req.body;
        const token=jsonWebToken.sign(req.body,myJWTSecretKey);
        res.cookie('token',token);
        res.json("Log in exitoso");
    },
    logout: (req,res)=>{
        res.clearCookie("token");
        res.clearCookie("orden");
        res.json("Sesión finalizada");
    },

    addproduct:(req,res,next)=>{
        const {ID_PRODUCTO,CANTIDAD_PRODUCTO,PAGO_TIPO,USUARIO,DIRECCION,MAIL}=req.body;
        DB.query("SELECT NUMERO FROM ORDERS_INFO WHERE ESTADO='NUEVO' AND USUARIO='"+USUARIO+"'" ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            const id=resultado[0].NUMERO;
            DB.query("SELECT  NAME_PRODUCT,PRICE_PRODUCT FROM PRODUCTS_INFO WHERE ID= "+ID_PRODUCTO, {
                type:DB.QueryTypes.SELECT})
              .then((resultado) => {
                const precio=resultado[0].PRICE_PRODUCT;
                const nombre=resultado[0].NAME_PRODUCT;
                DB.query("INSERT INTO ORDERS_PRODUCTS (ID_ORDER,ID_PRODUCT, PRODUCT_NAME, AMOUNT_PRODUCT, PRICE_PRODUCT) VALUES ('"+id+"','"+ID_PRODUCTO+"','"+nombre+"', '"+CANTIDAD_PRODUCTO+"', '"+precio+"')",{
                    type:DB.QueryTypes.INSERT
                }) .then((result) => {
                    res.json("Producto agregado con éxito");
                    next();
                });
            });
        });
    },
    packorder:(req,res)=>{
        const {ID_PRODUCTO,CANTIDAD_PRODUCTO,PAGO_TIPO,USUARIO,DIRECCION,MAIL}=req.body;
        DB.query("SELECT NUMERO FROM ORDERS_INFO WHERE ESTADO='NUEVO' AND USUARIO='"+USUARIO+"'" ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            const id=resultado[0].NUMERO;
            DB.query("SELECT * FROM ORDERS_PRODUCTS WHERE ID_ORDER='"+id+"'" ,{
                type:DB.QueryTypes.SELECT
            }).then((resultado) => {
                const mock=resultado;
                var total = 0;
                var descripcion = '';
                for (i = 0; i < mock.length; i++) {
                    total= total+ mock[i].PRICE_PRODUCT;
                    descripcion+= mock[i].AMOUNT_PRODUCT + "x" + mock[i].PRODUCT_NAME +" " ;
                  }
                  DB.query("UPDATE ORDERS_INFO SET DESCRIPCION='"+descripcion+"',PAGO_MONTO="+total+" WHERE USUARIO='"+USUARIO+"' AND ESTADO='NUEVO'",{
                    type:DB.QueryTypes.UPDATE
                }).then((resultado) => {
                    res.json("Orden armada");
                })
            })
        })
    },
    previeworder:(req,res)=>{
        const {ID_PRODUCTO,CANTIDAD_PRODUCTO,PAGO_TIPO,USUARIO,DIRECCION,MAIL}=req.body;
        DB.query("SELECT * FROM ORDERS_INFO WHERE ESTADO='NUEVO' AND USUARIO='"+USUARIO+"'" ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            res.json(resultado);
        })

    },
    createorder:(req,res,next)=>{
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var horario= h+ ':' +m+ ':'+s;
        const cookie=req.cookies.orden;
        if (cookie=='nueva'){
            next();
        }
        else{
            const {ID_PRODUCTO,CANTIDAD_PRODUCTO,PAGO_TIPO,USUARIO,DIRECCION,MAIL}=req.body;
            DB.query("INSERT INTO ORDERS_INFO (ESTADO,HORA,PAGO_TIPO,USUARIO,DIRECCION) VALUES ('NUEVO', '"+horario+"','"+PAGO_TIPO+"','"+USUARIO+"','"+DIRECCION+"')",{
                type:DB.QueryTypes.INSERT
            })
            res.cookie('orden',"nueva");
            next();
        }
    },
    deleteproductorder: (req,res,next) => {
        const {ID_PRODUCTO,CANTIDAD_PRODUCTO,PAGO_TIPO,USUARIO,DIRECCION,MAIL}=req.body;
        DB.query("SELECT NUMERO FROM ORDERS_INFO WHERE ESTADO='NUEVO' AND USUARIO='"+USUARIO+"'" ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            const id=resultado[0].NUMERO;
            DB.query("DELETE FROM ORDERS_PRODUCTS WHERE ID_PRODUCT="+ID_PRODUCTO+" AND ID_ORDER="+id+"",{
                type:DB.QueryTypes.DELETE
            }) .then((resultado) => {
                res.json("Producto eliminado con exito");
                next();
            });
        })
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
    addadminuser: (req,res) => {
        const {USER, NOMBRE_APELLIDO, MAIL, TELEFONO, DIRECCION,PASS}=req.body;
        DB.query("INSERT INTO USERS_INFO (USUARIO, NOMBRE_APELLIDO, CORREO, TELEFONO, DIRECCION, ADMIN,PASSWORD) VALUES ('"+USER+"', '"+NOMBRE_APELLIDO+"', '"+MAIL+"','"+TELEFONO+"', '"+DIRECCION+"', '1', '"+PASS+"')",{
            type:DB.QueryTypes.INSERT
        }) .then((resultado) => {
            res.json("Usuario administrador agregado con exito");
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
        const {MAIL,NUMERO}=req.body;
        DB.query('SELECT ESTADO,DESCRIPCION,PAGO_MONTO,PAGO_TIPO, DIRECCION FROM ORDERS_INFO WHERE NUMERO='+ NUMERO ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            res.json(resultado);
        });
},
    deleteorder: (req,res) => {
        const {MAIL,NUMERO}=req.body;
        DB.query("DELETE FROM ORDERS_INFO WHERE NUMERO="+NUMERO+"" ,{
            type:DB.QueryTypes.DELETE
        }).then((resultado) => {
            res.json("Orden eliminada con exito");
        });
    },
    cancelorder: (req,res) => {
        const {MAIL,NUMERO}=req.body;
        DB.query('UPDATE ORDERS_INFO SET ESTADO="CANCELADO" WHERE NUMERO='+ NUMERO ,{
            type:DB.QueryTypes.UPDATE
        }).then((resultado) => {
            res.json("La orden número "+ NUMERO + " ha sido cancelada");
        });
},
    call: (req,res) => {
        const {MAIL,USUARIO}=req.body;
        DB.query("SELECT TELEFONO FROM USERS_INFO WHERE USUARIO='"+USUARIO+"'"  ,{
            type:DB.QueryTypes.SELECT
        }).then((resultado) => {
            res.send(`El teléfono del usuario es <a href=tel:  ${resultado[0].TELEFONO} > ${resultado[0].TELEFONO} </a>`);
        });
},

}