// comment라는 테이블.
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('comment', {
        comment: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        created_at : {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()'),
        }
    }, {
        timestamps: false, // 얘가 true 면 createAt 과 updateAt 이 자동으로 입력되더라. 
        underscored: true,
    });
};

// CREATE TABLE nodejs.comments (
//     -> id INT NOT NULL AUTO_INCREMENT,
//     -> commenter INT NOT NULL,
//     -> comment VARCHAR(100) NOT NULL,
//     -> created_at DATETIME NOT NULL DEFAULT now(),
//     -> PRIMARY KEY(id),
//     -> INDEX commenter_idx (commenter ASC),
//     -> CONSTRAINT commenter
//     -> FOREIGN KEY (commenter)
//     -> REFERENCES nodejs.users (id)
//     -> ON DELETE CASCADE
//     -> ON UPDATE CASCADE)
//     -> COMMENT = '댓글'
//     -> DEFAULT CHARSET=utf8
//     -> ENGINE=InnoDB;