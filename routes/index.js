const express=require("express");
const router=express.Router();
const controlador=require("../controller/index");
const jsonWebToken=require('jsonwebtoken');
const myJWTSecretKey= 'adafrtw445!def_?gdf';
const cookieparser=require("cookie-parser");
router.use(cookieparser());
const validateDto=require('../middleware/validate-dto');
const verify=require('../middleware/verify');
const devDto=require('../dto/dev');


//router.post('/dev',validateDto(devDto),devController.createdev)

router.post('/logout',controlador.logout)

router.post('/login',validateDto(devDto.login),verify.verifypass,controlador.login);

router.post('/add/user',validateDto(devDto.adduser),verify.verifyuser,verify.verifymail, controlador.adduser);

router.get('/call',validateDto(devDto.call),verify.verifytoken,verify.useradmin,controlador.call)

router.get('/view/product-list',validateDto(devDto.mail),verify.verifytoken,controlador.productlist)

router.post('/add/product-to-resto',validateDto(devDto.addproduct),verify.verifytoken,verify.useradmin,verify.verifyproduct,controlador.addproducttoresto)

router.post('/edit/product-to-resto',validateDto(devDto.changeproduct),verify.verifytoken,verify.useradmin,verify.verifyproducttochange,controlador.editproducttoresto)

router.post('/eliminate/product-to-resto',validateDto(devDto.changeproduct),verify.verifytoken,verify.useradmin,verify.verifyproducttochange,controlador.eliminateproducttoresto)

router.post('/create/order',validateDto(devDto.order),verify.verifytoken,verify.addproducttoorder,controlador.createorder);

router.post('/confirm/order',validateDto(devDto.order),verify.verifytoken,controlador.confirmorder);

router.post('/update/orderstatus',validateDto(devDto.orderstatus),verify.verifytoken,verify.useradmin,verify.statusorder,controlador.updateorderstatus);

router.get('/view/order-list',validateDto(devDto.mail),verify.verifytoken,verify.useradmin,controlador.orderlist)

router.get('/view/order',validateDto(devDto.mailnum),verify.verifytoken,controlador.order)

router.post('/cancel/order',validateDto(devDto.mailnum),verify.verifytoken,verify.useradmin,controlador.cancelorder)

module.exports=router;