
"use strict";


const cfg = require('../cfg');
const _ = require('underscore');
const bunyan = require('bunyan');
const log = bunyan.createLogger(_.extend(cfg.logging, {name: 'user'}));


module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type:DataTypes.STRING(125),
      allowNull: false
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    hash: {
      type:DataTypes.STRING,
    },
    salt: {
      type:DataTypes.STRING,
    },
    status:{
      type: DataTypes.ENUM,
      values: ['active', 'pending', 'free'],
      defaultValue: 'free'
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'users'
  });

  return User;
}
