const express = require('express')
const path = require('path')
const fetch = require('node-fetch')
const redis = require('./redis-client')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/api/post', async (req, res) => {
    const ip =  req.headers['x-forwarded-for'] ||
     req.socket.remoteAddress
     const count =await redis.incr(ip)
     redis.expire(ip,2)
     if(count >=10 && count <=15){
         return res.json({
             status:"about-to-rate-limit"
         })
     }else if(count >15){
         return res.json({
             status:"rate-limited"
         })
     }

	// implement rate limiting
	return res.json({
		status: 'ok'
	})
})

app.listen(process.env.PUBLIC_PORT)
