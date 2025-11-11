import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AtendimentoService } from '../atendimento.service';
import notyf from 'app/utils/utils';

@Component({
    selector: 'app-relatorio-modal',
    templateUrl: './relatorio-modal.component.html',
    styleUrls: ['./relatorio-modal.component.scss'],
})
export class RelatorioModalComponent implements OnInit {
    filtroForm!: FormGroup;
    pacienteId!: number;
    pacienteNome!: string;
    today!: string;

    constructor(
        private _dialogRef: MatDialogRef<RelatorioModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _atendimentoService: AtendimentoService,
        private _fb: FormBuilder
    ) {
        // Dados recebidos do componente pai
        this.pacienteId = data.pacienteId;
        this.pacienteNome = data.pacienteNome;
    }

    ngOnInit(): void {
        // Data atual em formato ISO para o input[type=date]
        this.today = new Date().toISOString().split('T')[0];

        // Formulário de filtro
        this.filtroForm = this._fb.group({
            dataInicio: [''],
        });
    }

    gerarRelatorios(): void {
        const { dataInicio } = this.filtroForm.value;

        if (!this.pacienteId) {
            notyf.error('Paciente não identificado.');
            return;
        }

        this._atendimentoService
            .gerarRelatorios(this.pacienteId, dataInicio)
            .subscribe({
                next: (pdfBlob) => {
                    const blob = new Blob([pdfBlob], {
                        type: 'application/pdf',
                    });
                    const url = window.URL.createObjectURL(blob);
                    window.open(url);
                    notyf.success('Relatório gerado com sucesso!');
                    this._dialogRef.close();
                },
                error: async (err) => {
                    console.error(err);
                    let mensagem = 'Erro ao gerar relatório.';
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
                },
            });
    }

    fechar(): void {
        this._dialogRef.close();
    }
}
