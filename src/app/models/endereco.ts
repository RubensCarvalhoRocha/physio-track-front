import { Cidade } from './cidade';

export class Endereco {
    id?: number;
    rua?: string;
    cep?: string;
    cidade?: Cidade;
    estadoId?: number;

    constructor(endereco?: Partial<Endereco>) {
        if (endereco) {
            Object.assign(this, endereco);
        }
    }
}
