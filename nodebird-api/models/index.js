const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const  sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Domain = require('./domain')(sequelize, Sequelize);

db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

// 다대다 관계. --> 새로운 모델(테이블)이 생성됨.
db.Post.belongsToMany(db.Hashtag, { through : 'PostHashtag'});
db.Hashtag.belongsToMany(db.Post, { through : 'PostHashtag'});

// 팔로잉 팔로워 관계.
// foreignKey를 통해 사용자의 id 를 구분! 
db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followers', foreignKey: 'followingId'});
db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followings', foreignKey: 'followerId'});

// 좋아요 기능.  + as는 별칭 느낌?? 이 명칭으로 sequelize 에서 데이터를 넣고 빼는 작업을 쉽게 할 수 있다.
db.User.belongsToMany(db.Post, { through : 'Like', as: 'Likes'});
db.Post.belongsToMany(db.User, { through : 'Like',  as: 'Liker'});

// 1:다 관계.
db.User.hasMany(db.Domain);
db.Domain.belongsTo(db.User);

module.exports = db;
