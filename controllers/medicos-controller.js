const { response } = require('express');
const Medico = require('../models/medico');

const getMedico = async (req, res = response) => {

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img')

    res.json({
        ok: true,
        medicos
    });

}


const getMedicobyId = async (req, res = response) => {

    const id = req.params.id;

    try {
        const medicos = await Medico.findById(id)
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img')

        res.json({
            ok: true,
            medicos
        });
    } catch (error) {
        console.log(error);
         res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

    

}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico( {
        usuario: uid,
        ...req.body
    });

    try {
        
        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        console.log(error);
         res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const actualizarMedico = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        
        const medico = await Medico.findById( id );

        if(!medico) {
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por id.',
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const MedicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: MedicoActualizado
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarMedico = async (req, res = response) => {

    const id = req.params.id;

    try {
        
        const medico = await Medico.findById( id );

        if(!medico) {
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por id.',
            });
        }

        await Medico.findByIdAndDelete( id );
       
        res.json({
            ok: true,
            msg: 'Medico eliminado.'
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {
    getMedico,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicobyId
}