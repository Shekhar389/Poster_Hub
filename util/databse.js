const Sequelize = require('sequelize');
const sequelize= new Sequelize('node-complete','root','kshekhar123',{dialect : 'mysql', host :'localhost' });

module.exports=sequelize;