const yup=require('yup');

module.exports={
    call : yup.object().shape({
        MAIL:yup.string().required().email(),
        USUARIO:yup.string().required()
    }),
    login : yup.object().shape({
        MAIL:yup.string().required().email(),
        PASS:yup.string().required()
    }),
    adduser : yup.object().shape({
        USER:yup.string().required(),
        NOMBRE_APELLIDO:yup.string().required(),
        MAIL:yup.string().required().email(),
        TELEFONO:yup.string().required(),
        DIRECCION:yup.string().required(),
        ADMIN:yup.number().integer()
    }),
    mail : yup.object().shape({
        MAIL:yup.string().required().email()
    }),
    addproduct : yup.object().shape({
        NAME_PRODUCT:yup.string().required(),
        PRICE_PRODUCT:yup.number().positive().integer().required(),
        IMAGE_PRODUCT:yup.string().required().url(),
        MAIL:yup.string().required().email()
    }),
    changeproduct : yup.object().shape({
        ID:yup.number().positive().integer().required(),
        NAME_PRODUCT:yup.string().required(),
        PRICE_PRODUCT:yup.number().positive().integer().required(),
        IMAGE_PRODUCT:yup.string().required().url(),
        MAIL:yup.string().required().email()
    }),
    order : yup.object().shape({
        ID_PRODUCTO:yup.number().positive().integer().required(),
        CANTIDAD_PRODUCTO:yup.number().positive().integer().required(),
        PAGO_TIPO:yup.string().required(),
        USUARIO:yup.string().required(),
        DIRECCION:yup.string().required(),
        MAIL:yup.string().required().email()
    }),
    orderstatus : yup.object().shape({
        ESTADO:yup.string().required(),
        NUMERO:yup.number().positive().integer().required(),
        MAIL:yup.string().required().email()
    }),
    mailnum : yup.object().shape({
        MAIL:yup.string().required().email(),
        NUMERO:yup.number().positive().integer().required()
    }),
}


