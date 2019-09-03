// user 라는 모델 (단수형) --> users 라는 테이블( 복수형 )
// db에 users 라는 테이블이 없다면 만들어낸다.
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true
            },
            age: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false
            },
            married:{
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('now()'),
            }
    }, {
        timestamps: false,
        underscored: true,
    });
};

// CREATE TABLE nodejs.users (
//     -> id INT NOT NULL AUTO_INCREMENT,
//     -> name VARCHAR(20) NOT NULL, 
//     -> age INT UNSIGNED NOT NULL,
//     -> married TINYINT NOT NULL,
//     -> comment TEXT NULL,
//     -> created_at DATETIME NOT NULL DEFAULT now(),
//     -> PRIMARY KEY(id),
//     -> UNIQUE INDEX name_UNIQUE (name ASC)) 
//     -> COMMENT = '사용자 정보'
//     -> DEFAULT CHARSET=utf8
//     -> ENGINE=InnoDB;