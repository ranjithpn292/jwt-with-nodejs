// to load the .env vaiables into process
require('dotenv').config()

const express = require('express');
const app = express()
const jwt = require('jsonwebtoken')



app.use(express.json())


const posts = [
    {
        "username": "raj",
        "post": "1 post"
    },
    {
        "username": "sam",
        "post" : "2 post"
    }
]

app.get('/getPosts',authenticateToken,(req,res)=>{
    res.json(posts.filter(post => post.username === req.user.name))
})


function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    // since token comes in the form of (BEARER token) take 2nd parameter as below
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null){
        //send a status code as they have not sent a token
        return res.sendStatus(401)
    }

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            //dont have access token no longer valid
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

app.listen(3000)