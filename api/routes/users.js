const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

require('dotenv').config();

const User = require('../models/user')

authorizeUser = (req, res, next) => {
	const bearerHeader = req.headers['authorization']
	if(typeof bearerHeader !== 'undefined'){
		const bearer = bearerHeader.split(' ')
		const bearerToken = bearer[1]
		req.token = bearerToken
		next()
	}else{
		res.status(403).json({
			message: "Token not verified!"
		})
	}
}

router.get('/profile', authorizeUser, (req, res) => {
	jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, userData) => {
		if(err){
			return res.status(403).json({
				error: err
			})
		}else{
			User.findOne({ email: userData.email }).exec().then(
				result => {
					return res.status(200).json({
						userProfile: result
					})
				}
			).catch(
				err => {
					return res.status(500).json({
						error: err
					})
				}
			)
		}
	})
		
})

router.patch('/profile', authorizeUser, (req, res) => {
	const updateObject = req.body
	jwt.verify(req.token, `${process.env.JWT_SECRET_KEY}`, (err, userData) => {
		if(err){
			return res.status(403).json({
				error: err
			})
		}else{
			User.updateOne({ email: userData.email }, { $set: updateObject }).exec().then(
				result => {
					res.status(200).json({
						message: "Updated"
					})
				}
			).catch(
				err => {
					console.log("error: ", err)
					res.status(500).json({
						error: err
					})
				}
			)
		}
	})
})

module.exports = router