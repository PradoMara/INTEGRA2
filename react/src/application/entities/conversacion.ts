import {v4 as uuidv4} from 'uuid';  

export class Conversacion {
    public readonly id: string;
    public participantes : string[];
    public ultimoMensajeID : string | null;
    public readonly creadoEn : Date;

    constructor(participantes : string[]) {
        if (participantes.length < 2) {
            throw new Error("Una conversacion debe tener al menos dos actores.");
        }

        this.id = uuidv4();
        this.participantes = participantes;
        this.ultimoMensajeID = null;
        this.creadoEn = new Date();
    }
}   