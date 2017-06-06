'use strict';

const cfg = require('../../cfg');
const _ = require('underscore');
const bunyan = require('bunyan');
const log = bunyan.createLogger(_.extend(cfg.logging, {name: 'role'}));

const models = require('../../models');

function getAll(req, res, next) {
	
	models.Role.findAll({
		attributes: [
		'id',
		'name',
		'active']
	})
	.then((roles) => {
		return res.status(200).json(roles);
	})
	.catch((err) => {
		log.error('encountered database error when get all roles %j', err);
		return res.status(500).json({
			success: 0,
			description : 'database error when getting roles'
		});
	});
}


function save(req, res, next) {
	log.debug('POST role= %j', req.body);

	models.Role.create(req.body)
	.then((role) => {
		log.debug('saved role with id = ' + role.id)
		return res.status(200).json({success: 1,description: "Role saved into database!"});
	}).catch((err) => {
		log.error('encountered database error when save role %s error=%s', req.body.name, err);
		return res.status(500).json({
			success: 0,
			description:'error when save role to database'
		});
	})	
}

function getOne(req, res, next) {
	var id = req.swagger.params.id.value;
	
	models.Role.findById(id)
	.then((role) => {
		if (!role) {
			return res.status(200).json({success: 0 ,description: "can't find role by id!"});
		}

		log.debug('GET role by id = %j', role.id);
		return res.status(200).json(role);
	})
	.catch((err) => {
		log.error('encountered database error when fetching role by id %s', id);
		return res.status(500).json({
			success: 0,
			description : 'error when find role by id'
		});
	});
}

function update(req, res, next) {
	var id = req.swagger.params.id.value;
	var body = req.body;
	
	delete body._id;
	log.debug('calling put role =%j', body);
	
	models.Role.findById(id)
	.then((role) => {
		if (!role) {
			res.status(200).json({success: 0 ,description: "update - can't find role by id!"});
		} else {
			log.debug('Call Update role by id = %j', id);
			_.assign(role, body);
			//role.updateAttributes(body);
			return role.save();
		}
	})
	.then((role) => {
		log.debug('role id=%s has been updated', id);
		return res.status(200).json({success: 1, description: 'role '+ id +' updated!'});
	})
	.catch((err) => {
		log.error('encountered database error when updating role by id=%s', id);
		return res.status(500).json({
			success: 0,
			description : 'database error when update role by id'
		});
	});
}

function delRole(req, res, next) {
	var id = req.swagger.params.id.value;
	
	log.debug('HTTP DELETE /roles/%s', id);

	models.Role.findById(id)
	.then((role) =>{
		if (!role) {
			return res.status(200).json({success: 0 ,description: "delete - can't find role by id!"});
		} else {
			return role.destroy();
		}
	})
	.then(()=> {
		log.debug('roles id=%s has been deleted', id);
		return res.status(200).json({success: 1, description: 'role '+ id +' deleted!'});
	})
	.catch((err) => {
		log.error('encountered database error when delete role by id, %j', err);
		return res.status(500).json({
			success: 0,
			description : 'database error when update role by id'
		});
	});
}

module.exports = {getAll, save, getOne, update, delRole};