const {Sequelize}=require('sequelize')
const sequelize=new Sequelize('signup_db','root','12345',{
    host:'localhost',
    dialect:'mysql'
})
module.exports=sequelize;