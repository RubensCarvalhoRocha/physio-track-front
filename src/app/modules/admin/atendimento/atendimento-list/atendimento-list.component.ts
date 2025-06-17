import { AtendimentoCompleto } from 'app/models/atendimentoCompleto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AtendimentoService } from '../atendimento.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import notyf from 'app/utils/utils';
@Component({
    selector: 'app-atendimento-list',
    templateUrl: './atendimento-list.component.html',
    styleUrls: ['./atendimento-list.component.scss'],
})
export class AtendimentoListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    atendimentosDataSource = new MatTableDataSource<AtendimentoCompleto>();
    atendimentosColumns: string[] = [
        'paciente',
        'profissional',
        'tipoAtendimento',
        'dataAtendimento',
        'acoes',
    ];

    constructor(
        private _atendimentoService: AtendimentoService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._atendimentoService.atendimentos$.subscribe((data) => {
            this.atendimentosDataSource.data = data;
        });

        this.atendimentosDataSource.filterPredicate = (
            data: AtendimentoCompleto,
            filter: string
        ) => {
            return (
                data.paciente?.nome?.toLowerCase().includes(filter) ||
                data.usuario?.pessoa?.nome?.toLowerCase().includes(filter)
            );
        };

        setTimeout(() => {
            this.atendimentosDataSource.sort = this.sort;
            this.atendimentosDataSource.paginator = this.paginator;
        });
    }

    filtrar(text: string) {
        this.atendimentosDataSource.filter = text.trim().toLowerCase();
    }

    editarAtendimento(id: number) {
        this._router.navigate(['/atendimento', id]);
    }

    cadastrarAvaliacao(atendimentoId: number): void {
        this._router.navigate([
            '/atendimento',
            'avaliacao',
            'novo',
            atendimentoId,
        ]);
    }

    gerarRelatorio(atendimentoId: number): void {
        this._atendimentoService.gerarRelatorio(atendimentoId).subscribe({
            next: (pdfBlob) => {
                const blob = new Blob([pdfBlob], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url);

                notyf.success('Relatório gerado com sucesso!');
                this._router.navigate(['/atendimentos']);
            },
            error: async (err) => {
                console.log(err);

                let mensagem = 'Erro ao gerar relatório.';

                // Se o erro for Blob, tenta extrair texto e parsear como JSON
                if (
                    err?.error instanceof Blob &&
                    err.error.type === 'application/json'
                ) {
                    const text = await err.error.text();
                    try {
                        const json = JSON.parse(text);
                        mensagem = json?.message || mensagem;
                    } catch (e) {
                        // Não era JSON válido
                    }
                }

                notyf.error(mensagem);
            },
        });
    }
}
