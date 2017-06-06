'use strict';

const cfg = require('../../cfg');
const _ = require('underscore');
const bunyan = require('bunyan');
const log = bunyan.createLogger(_.extend(cfg.logging, {name: 'user'}));

const models = require('../../models');

function getUsers(req, res, next) {
	
	models.User.findAll({
		attributes: [
		'id',
		'username',
		'email',
		'active',
		'status']
	})
	.then((users) => {
		return res.status(200).json(users);
	})
	.catch((err) => {
		log.error('encountered database error when get all users %j', err);
		return res.status(500).json({
			success: 0,
			description : 'database error when getting users'
		});
	});
}


function saveUser(req, res, next) {
	log.debug('POST user= %j', req.body);

	models.User.create(req.body)
	.then((user) => {
		log.debug('saved user with id = ' + user.id)
		return res.status(200).json({success: 1,description: "User saved into database!"});
	}).catch((err) => {
		log.error('encountered database error when save user %s error=%s', req.body.username, err);
		return res.status(500).json({
			success: 0,
			description:'error when save user to database'
		});
	})	
}

function getUserById(req, res, next) {
	var id = req.swagger.params.id.value;
	
	models.User.findById(id)
	.then((user) => {
		if (!user) {
			return res.status(200).json({success: 0 ,description: "can't find user by id!"});
		}

		log.debug('GET user by id = %j', user.id);
		return res.status(200).json(user);
	})
	.catch((err) => {
		log.error('encountered database error when fetching user by id %s', id);
		return res.status(500).json({
			success: 0,
			description : 'error when find user by id'
		});
	});
}

function updateUser(req, res, next) {
	var id = req.swagger.params.id.value;
	var body = req.body;
	
	delete body._id;
	log.debug('calling put user =%j', body);
	
	models.User.findById(id)
	.then((user) => {
		if (!user) {
			res.status(200).json({success: 0 ,description: "update - can't find user by id!"});
		} else {
			log.debug('Call Update user by id = %j', id);
			_.assign(user, body);
			//user.updateAttributes(body);
			return user.save();
		}
	})
	.then((user) => {
		log.debug('user id=%s has been updated', id);
		return res.status(200).json({success: 1, description: 'user '+ id +' updated!'});
	})
	.catch((err) => {
		log.error('encountered database error when updating user by id=%s', id);
		return res.status(500).json({
			success: 0,
			description : 'database error when update user by id'
		});
	});
}

function deleteUser(req, res, next) {
	var id = req.swagger.params.id.value;
	
	log.debug('HTTP DELETE /resources/%s', id);

	models.User.findById(id)
	.then((user) =>{
		if (!user) {
			return res.status(200).json({success: 0 ,description: "delete - can't find user by id!"});
		} else {
			return user.destroy();
		}
	})
	.then(()=> {
		log.debug('users id=%s has been deleted', id);
		return res.status(200).json({success: 1, description: 'user '+ id +' deleted!'});
	})
	.catch((err) => {
		log.error('encountered database error when delete user by id, %j', err);
		return res.status(500).json({
			success: 0,
			description : 'database error when update user by id'
		});
	});
}

module.exports = {getUsers, saveUser, getUserById, updateUser, deleteUser};
