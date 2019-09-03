'use strict';
// sequelize에서 가장 중요한 파일!!
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development'; // production 용도 있음.
const config = require(__dirname + '/../config/config.json')[env]; // sequelize 에 대한 설정 파일.
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config); // 생성자. 인스턴스화!! 설정파일에 있는 얘를 불러오는 것.
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db 라는 객체에 넣어서 앞으로 사용할 것임.
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize); // sequelize 인스턴스랑 패키지가 다른 파일의 module.exports 부분과 이어짐.
db.Comment = require('./comment')(sequelize, Sequelize);

// one to many 관계.
db.User.hasMany(db.Comment, {foreignKey: 'commenter', sourceKey: 'id'})
db.Comment.belongsTo(db.User, {foreignKey: 'commenter', targetKey: 'id'})

module.exports = db;
