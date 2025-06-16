export class Endereco {
    id?: number;
    rua?: string;
    cep?: string;
    cidade?: string;
    estadoId?: number;

    constructor(endereco?: Partial<Endereco>) {
        if (endereco) {
            Object.assign(this, endereco);
        }
    }
}
