const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jws');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'email no encontrado'
            });
        }

        // verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'contraseña no valida'
            });
        }

        // Generar el token - JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
          ok: false,
          msg: 'Error inesperado...'
        });
    }

}

const googleSignIn = async( req, res = response ) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture} = await googleVerify( googleToken );
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            // si no es existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // guardar en DB
        await usuario.save();

        // Generar el token - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        res.status(401).json({
          ok: false,
          msg: 'Token no es correcto'
        });
    }
}

const refreshToken = async( req, res = response ) => {

    const uid = req.uid;

    // Generar el token - JWT
    const token = await generarJWT( uid );

    // Obtener usuario por uid
    const usuarioDB = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuarioDB
    });

}

module.exports = {
    login,
    googleSignIn,
    googleVerify,
    refreshToken
}
