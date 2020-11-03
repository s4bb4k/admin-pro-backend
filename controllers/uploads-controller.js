const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = ( req , res = response ) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    // validar tipo
    const tipoValidos = ['hospitales', 'medicos', 'usuarios'];
    if ( !tipoValidos.includes(tipo) ) {
        return res.json({
            ok: false,
            msg: 'No es medico, usuario u hospital'
        });
    }

    // validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    // Procesar la imagen...
    const file = req.files.imagen;
    const nombrecortado = file.name.split('.');
    const extensionArchivo = nombrecortado[ nombrecortado.length - 1 ];

    // validar extension
    const extensionesValida = ['png', 'jpg', 'gpeg', 'gif'];
    if( !extensionesValida.includes(extensionArchivo) ) {
        return res.status(400).json({
            ok: false,
            msg: 'una es una extension valida'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`

    // Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // mover la imagen
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            })
        }

        // Actualizar base de datos
        actualizarImagen( tipo, id, nombreArchivo );

        res.json({
            ok: true,
            msg: 'Archivo subido ',
            nombreArchivo
        });
    });

}

const retornaImagen = ( req, res ) => {
    
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );
    
    // imagen por defecto
    if( fs.existsSync( pathImg ) ) {
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-img.jpg` );
        res.sendFile( pathImg );
    }

}


module.exports = {
    fileUpload,
    retornaImagen
}

