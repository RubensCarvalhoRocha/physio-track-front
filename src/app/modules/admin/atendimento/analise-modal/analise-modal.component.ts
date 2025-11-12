import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AtendimentoService } from '../atendimento.service';
import { Component, Inject } from '@angular/core';
import notyf from 'app/utils/utils';

@Component({
    selector: 'app-analise-modal',
    templateUrl: './analise-modal.component.html',
    styleUrls: ['./analise-modal.component.scss'],
})
export class AnaliseModalComponent {
    analiseTexto: string = '';
    carregando: boolean = false;
    pacienteId!: number;
    pacienteNome!: string;

    constructor(
        private _dialogRef: MatDialogRef<AnaliseModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _atendimentoService: AtendimentoService
    ) {
        // Dados recebidos do componente pai
        this.pacienteId = data.pacienteId;
        this.pacienteNome = data.pacienteNome;
    }

    ngOnInit(): void {}

    gerarAnalise(): void {
        if (!this.pacienteId) {
            notyf.error('Paciente não identificado.');
            return;
        }

        this.carregando = true;
        this._atendimentoService.gerarAnalise(this.pacienteId).subscribe({
            next: (texto: string) => {
                this.analiseTexto = texto;
                notyf.success('Análise gerada com sucesso!');
                this.carregando = false;
            },
            error: async (err) => {
                console.error(err);
                let mensagem = 'Erro ao gerar análise.';
                if (
                    err?.error instanceof Blob &&
                    err.error.type === 'application/json'
                ) {
                    const text = await err.error.text();
                    try {
                        const json = JSON.parse(text);
                        mensagem = json?.message || mensagem;
                    } catch {}
                }
                notyf.error(mensagem);
                this.carregando = false;
            },
        });
    }

    fechar(): void {
        this._dialogRef.close();
    }
}
