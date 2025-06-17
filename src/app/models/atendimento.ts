import { Pessoa } from './pessoa';

export class Atendimento {
    id?: number;
    pacienteId!: number;
    tipoAtendimento!: string;
    dataAtendimento!: Date;
    descricao!: string;
    paciente?: Pessoa;

    constructor(atendimento?: Partial<Atendimento>) {
        if (atendimento) {
            Object.assign(this, atendimento);
        }
    }
}
