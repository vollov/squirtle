'use strict';

const cfg = require('../../cfg');
const _ = require('underscore');
const bunyan = require('bunyan');
const log = bunyan.createLogger(_.extend(cfg.logging, {name: 'user'}));

const models = require('../../models');

function getAll(req, res, next) {
	
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
			message : 'database error when getting users'
		});
	});
}


function save(req, res, next) {
	log.debug('POST user= %j', req.body);
	var user = new User(req.body);

	user.save(function(err, user) {
		if (err) {
			//return next(err);
			return res.status(500).json({
				success: db.save(req.body),
				description:'error when save user to database'
			});
		}

		log.debug('saved user with id = ' + user.id)
		res.status(200).json({success: 1,description: "User saved into database!"});
	});	
}

function getOne(req, res, next) {
	var id = req.swagger.params.id.value;
	
	var query = User.findById(id);

	query.exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			//return next(new Error("can't find user by id"));
			res.status(200).json({success: 0 ,description: "can't find user by id!"});
		}
		
		log.debug('GET by id user= %j', user);
		res.status(200).json(user);
	});
}


function update(req, res, next) {
	var id = req.swagger.params.id.value;
	var body = req.body;
	
	delete body._id;
	log.debug('calling put user =%j', body);
	
	User.findByIdAndUpdate(id, { $set: body}, function (err, message) {
		//if (err) return handleError(err);
		if(err) return next(err);
		res.status(200).json({success: 1, description: 'user '+ id +' updated!'});
	});
}

function delUser(req, res, next) {
	var id = req.swagger.params.id.value;
	var query = User.findById(id).remove();
	
	query.exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return next(new Error("can't find user"));
		}
		
		log.debug('DELETE by id user= %j', user);
		res.status(200).json({success: 1, description: "User " + id + " deleted!"});
	});
}

module.exports = {getAll, save, getOne, update, delUser};
