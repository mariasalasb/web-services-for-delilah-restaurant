const{Sequelize}=require("sequelize");

const Database = {
    sequelize: function(){
            const sequelize= new Sequelize("USERS","root","root",{
                host: "localhost",
                dialect: "mysql",
            },
        );
        sequelize.authenticate()
            .then(function(){}) //exito
            .catch(error => console.log(error)) //error

        return sequelize;
    },
};

module.exports=Database;