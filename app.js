const express=require('express')
const bodyparser=require('body-parser');
const cors=require('cors')
const path=require('path');
const sequelize=require('./util/database');
const userRoutes=require('./routes/userRoutes')

const app=express();


app.use(cors())
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());


app.use(userRoutes)

app.get('*',(req,res)=>{
    const requestUrl=req.url;
    console.log(requestUrl);
    console.log(__dirname);
   
    if(!requestUrl.startsWith('/public/')){
        res.sendFile(path.join(__dirname,'views',req.url+'.html'))
        
    }
    else{
        res.sendFile(path.join(__dirname,'public',req.url))
    }

})


sequelize.sync()
.then(()=>{
    console.log("Database synced")
})
.catch((err)=>{
console.log(err);
})

app.listen(3000,()=>{
    console.log("server running in port http://localhost:3000")
})