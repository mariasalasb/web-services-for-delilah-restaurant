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

router.post('/logout',controlador.logout)

router.post('/login',validateDto(devDto.login),verify.verifypass,controlador.login);

router.put('/add/user',validateDto(devDto.adduser),verify.verifyuser,verify.verifymail, controlador.adduser);

router.put('/add/adminuser',validateDto(devDto.adduser),verify.useradmin,verify.verifyuser,verify.verifymail, controlador.addadminuser);

router.get('/call',validateDto(devDto.call),verify.verifytoken,verify.useradmin,controlador.call)

router.put('/add/product-to-resto',validateDto(devDto.addproduct),verify.verifytoken,verify.useradmin,verify.verifyproduct,controlador.addproducttoresto)

router.put('/edit/product-to-resto',validateDto(devDto.changeproduct),verify.verifytoken,verify.useradmin,verify.verifyproducttochange,controlador.editproducttoresto)

router.delete('/eliminate/product-to-resto',validateDto(devDto.changeproduct),verify.verifytoken,verify.useradmin,verify.verifyproducttochange,controlador.eliminateproducttoresto)

router.post('/view/product-list',validateDto(devDto.order),verify.verifytoken,controlador.createorder,controlador.productlist)

router.post('/addproduct/order',validateDto(devDto.order),verify.verifytoken,controlador.addproduct,controlador.packorder);

router.post('/preview/order',validateDto(devDto.order),verify.verifytoken,controlador.previeworder);

router.post('/deleteproduct/order',validateDto(devDto.order),verify.verifytoken,controlador.deleteproductorder,controlador.packorder);

router.put('/confirm/order',validateDto(devDto.order),verify.verifytoken,controlador.confirmorder);

router.put('/update/orderstatus',validateDto(devDto.orderstatus),verify.verifytoken,verify.useradmin,verify.statusorder,controlador.updateorderstatus);

router.delete('/delete/order',validateDto(devDto.mailnum),verify.verifytoken,verify.useradmin,verify.verifyordertochange,controlador.deleteorder);

router.get('/view/order-list',validateDto(devDto.mail),verify.verifytoken,verify.useradmin,controlador.orderlist)

router.get('/view/order',validateDto(devDto.mailnum),verify.verifytoken,controlador.order)

router.put('/cancel/order',validateDto(devDto.mailnum),verify.verifytoken,verify.useradmin,controlador.cancelorder)

module.exports=router;