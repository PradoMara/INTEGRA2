import { v4 as uuidv4 } from 'uuid'; // Importa la libreria para generar IDs unicos

export class Mensaje {
    public readonly id : string; // readonly se usa para que no se pueda modificar una vez creado
    public contenido : string;
    public autorID : string;
    public conversacionID : string;
    public leido : boolean;
    public readonly timestamp : Date;

    constructor(
        contenido : string,
        autorID : string,
        conversacionID : string,
    ) {
        this.id = uuidv4(); // Se asigna un ID unico al mensaje
        this.contenido = contenido;
        this.autorID = autorID;
        this.conversacionID = conversacionID;
        this.leido = false; // por que el mensaje por defecto no esta leido 
        this.timestamp = new Date(); // Marca el momento de creación del mensaje
    }
}