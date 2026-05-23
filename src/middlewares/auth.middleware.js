const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        // Verifica se token existe 

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticação não fornecido' 
            })
        }


        // Bearer token

        const [, token] = authHeader.split(' ');

        // verifica token 

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET  
        )


        // salva usuario na requisição

        req.usuario = decoded

        next();

    }catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Token de autenticação inválido'
        })
    }

    
}

module.exports = authMiddleware;

        
