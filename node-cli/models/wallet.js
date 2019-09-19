//https://sequelize.readthedocs.io/en/2.0/docs/models-definition/
module.exports = (sequelize, Sequelize) => {
    return sequelize.define('wallet', {
        money : {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '금액',
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: '설명',
        },
        type: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            comment: "TRUE- 수입, FALSE - 지출",
        }
    }, {
        timestamps: true,
        paranoid: true,  // don't delete database entries but set the newly added attribute deletedAt
        charset:'utf8', // 한글 사용 가능 하게끔
        collate:'utf8_general_ci', // 한글 사용 가능 하게끔
    })
}