"use strict";

const cfg = require('../cfg');
const _ = require('underscore');
const bunyan = require('bunyan');
const log = bunyan.createLogger(_.extend(cfg.logging, {name: 'role'}));


module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define("Role", {
    name: {
      type:DataTypes.STRING(125),
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'roles'
  });

  return Role;
}
