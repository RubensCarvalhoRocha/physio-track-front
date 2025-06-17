export class AtendimentoCompleto {
    id?: number;
    pacienteId!: number;
    tipoAtendimento!: string;
    dataAtendimento!: Date;
    descricao!: string;
    paciente!: { nome: string };
    usuario!: { pessoa: { nome: string } };

    constructor(atendimento?: Partial<AtendimentoCompleto>) {
        if (atendimento) {
            Object.assign(this, atendimento);
        }
    }
}
