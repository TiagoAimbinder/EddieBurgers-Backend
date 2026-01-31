import { AuthSrv } from "../services/Auth.service.js";


export class AuthCtr { 

    constructor() {
        this.AuthSrv = new AuthSrv();
    }; 

    login = async (req, res) => {
        const { usu_name, usu_password } = req.body;

        try {
            const user = { usu_name, usu_password }; 
            const data = await this.AuthSrv.login(user);
            res.status(200).json({ message: 'Usuario logeado correctamente', success: true, usu_token: data.token, usu_id: data.usu_id, role_id: data.role_id});
        // } catch (err) {
        //     res.status( err.statusCode || 500 ).json({ message: err.message || 'Error al logear el usuario', success: false, code: err.code || '' });
        // }
    }

    validateToken = async (req, res) => { 
        const { usu_id } = req.body;
        const authHeader = req.headers.authorization; 


        try {
            await this.AuthSrv.validateToken(usu_id, authHeader);
            res.status(200).json({ message: 'Token validado correctamente', success: true });
        } catch (err) {
            res.status( err.statusCode || 500 ).json({ message: err.message || 'Error al validar el token', success: false, code: err.code || '' });
        }        
    }
}