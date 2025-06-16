export class Atendimento {
    id?: number;
    pacienteId!: number;
    tipoAtendimento!: string;
    dataAtendimento!: Date;
    descricao!: string;

    constructor(atendimento?: Partial<Atendimento>) {
        if (atendimento) {
            Object.assign(this, atendimento);
        }
    }
}
