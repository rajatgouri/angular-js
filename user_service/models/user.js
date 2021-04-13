'use strict';

/**
 * User Model
 */
const crypto = require('crypto');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('User', {
        displayName: DataTypes.STRING,
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        hashedPassword: DataTypes.STRING,
        provider: DataTypes.STRING,
        salt: DataTypes.STRING,
        resetPasswordToken: DataTypes.STRING,
        resetPasswordExpires: DataTypes.DATE,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        mailNickname: DataTypes.STRING,
        department: DataTypes.STRING,
        refresh_token: DataTypes.TEXT,
        access_token_expires_on: DataTypes.BIGINT,
        // user history
        tableHistories: DataTypes.TEXT
    }
    );

    User.associate = function (models) {
        models.User.belongsToMany(models.Role, {
            through: { model: models.UserRoleMapping },
            foreignKey: 'userId',
            otherKey: 'roleId'
        });
        User.hasOne(models.UserPreference, {
            foreignKey: 'userId'
        });
    };

    User.prototype.toJSON = function () {
        const values = this.get();
        delete values.hashedPassword;
        delete values.salt;
        delete values.refresh_token;
        return values;
    };
    User.prototype.makeSalt = function () {
        return crypto.randomBytes(16).toString('base64');
    };
    User.prototype.authenticate = function (plainText) {
        return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
    };
    User.prototype.encryptPassword = function (password, salt) {
        if (!password || !salt) {
            return '';
        }
        salt = Buffer.from(salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    };
    return User;
};
