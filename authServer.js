// to load the .env vaiables into process
require('dotenv').config()

const express = require('express');
const app = express()
const jwt = require('jsonwebtoken')



app.use(express.json())

let refreshTokens = []


app.post('/login',(req,res)=>{
    // authenticate user
    const username = req.body.username
    const user = {name : username}

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    res.json({acessToken : accessToken, refreshToken: refreshToken})
})

app.delete('/logout',(req,res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/token',(req,res)=>{
    const refreshToken = req.body.token
    refreshTokens.push(refreshToken)
    if(refreshToken == null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
    if(err) return res.sendStatus(403)
    const accessToken = generateAccessToken({name : user.name})
    res.json({accessToken : accessToken})
   })    

})


function generateAccessToken(user){
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '15s'})
    return accessToken
}

app.listen(4000)