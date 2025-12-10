import { Endereco } from './endereco';

export class Pessoa {
    id?: number;
    nome?: string;
    email?: string;
    cpf?: string;
    telefone?: string;
    endereco?: Endereco;

    constructor(pessoa?: Partial<Pessoa>) {
        if (pessoa) {
            Object.assign(this, pessoa);
        }
    }
}
