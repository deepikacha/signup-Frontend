const {Sequelize}=require('sequelize')
const sequelize=require('../util/database')
const Message=sequelize.define('message',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    message:{
        type:Sequelize.TEXT,
        allowNull:false,
    },
    timestamp:{
        type:Sequelize.DATE,
        defaultValue: Sequelize.NOW

    }
})

module.exports=Message;