
import bcrypt from 'bcryptjs'; 

import { JWTSrv } from '../services/Jwt.service.js';
import { UserRep } from '../repositories/User.repository.js';
import { LogHistoryRep } from '../repositories/LogHistory.repository.js';
import { Database } from '../config/db.js';
import jwt from 'jsonwebtoken'


export class AuthSrv { 

    constructor() { 
        this.UserRep = new UserRep();
        this.LogHistoryRep = new LogHistoryRep();
    }

    get sequelize() { return Database.sequelize }


    login = async (data) => {

        const { usu_name, usu_password } = data; 
        const transaction = await this.sequelize.transaction(); 

        try {
            const user = await this.UserRep.findByName(usu_name, transaction);
            if (!user) throw { message: 'Datos incorrectos', statusCode: 401, code: '' };

            /**
             * Password validation w/ bcrypt
             * @param {String} usu_password 
             * @param {String} user.usu_password 
             */
            const validPassword = await bcrypt.compare(usu_password, user.usu_password)
            if (!validPassword) throw { message: 'Datos incorrectos', statusCode: 401, code: '' }

            /**
             * Create user log
             * @param {Int} usu_id
             */
            await this.LogHistoryRep.create(user.usu_id, transaction); 

            /**
             * Create JWT Token to send to user
             * @param {String} usu_name
             */
            const token = await JWTSrv.createToken(user.usu_name);

            /**
             * Update user on DB
             * @param {Int} usu_id
             * @param {String} token
             */
            await this.UserRep.updateToken(user.usu_id, { usu_token: token }, transaction);
            await transaction.commit()
            return { token: token, usu_id: user.usu_id, role_id: user.role_id}
        } catch (err) {
            await transaction.rollback()
            throw err; 
        }
    }

    validateToken = async (usu_id, authHeader) => {
        try {
            if (!authHeader) throw { message: 'No se ha enviado ningun token', statusCode: 400, code: '' }; 
            const usu_token = authHeader.split(' ')[1]; 

            const user = await this.UserRep.findByID(usu_id);
            if (!user) throw { message: 'No se ha encontrado un usuario con ese ID', statusCode: 404, code: '' };

            if (usu_token !== user.usu_token) {
                await this.UserRep.updateToken(usu_id, null);
                throw { message: 'El token ingresado no coincide con el token registrado', statusCode: 400, code: '' };
            }
            jwt.verify(usu_token, process.env.SECRET_KEY, async (err, decoded) => { 
                if (err) {
                    throw { message: 'El token no es valido', statusCode: 400, code: '' };

                }
            });
        } catch (err) {
            throw err;             
        }
    }; 


}