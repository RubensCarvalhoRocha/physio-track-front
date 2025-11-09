import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AtendimentoCompleto } from 'app/models/atendimentoCompleto';
import { MatTableDataSource } from '@angular/material/table';
import { AtendimentoService } from '../atendimento.service';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import notyf from 'app/utils/utils';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-atendimento-list',
    templateUrl: './atendimento-list.component.html',
    styleUrls: ['./atendimento-list.component.scss'],
})
export class AtendimentoListComponent implements OnInit {
    pacienteId?: number;
    pacienteNome?: string;
    filtroForm!: FormGroup;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('searchField') searchField!: ElementRef<HTMLInputElement>;

    atendimentosDataSource = new MatTableDataSource<AtendimentoCompleto>();
    atendimentosColumns: string[] = [
        'profissional',
        'tipoAtendimento',
        'dataAtendimento',
        'acoes',
    ];

    constructor(
        private _atendimentoService: AtendimentoService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _fb: FormBuilder
    ) {}

    ngOnInit(): void {
        // 🧱 Inicializa formulário de filtro
        this.filtroForm = this._fb.group({
            dataInicio: [''],
            dataFim: [''],
        });

        // 🧭 Usa switchMap para reagir ao idPaciente da rota
        this._route.paramMap
            .pipe(
                switchMap((params) => {
                    const idPacienteParam = params.get('idPaciente');
                    this.pacienteId = idPacienteParam
                        ? +idPacienteParam
                        : undefined;

                    // 🔹 Retorna a observable correta
                    return idPacienteParam
                        ? this._atendimentoService.atendimentosPorPaciente$
                        : this._atendimentoService.atendimentos$;
                })
            )
            .subscribe((data) => {
                this.atendimentosDataSource.data = data || [];
                if (data?.length && this.pacienteId) {
                    this.pacienteNome = data[0].paciente?.nome || '';
                }
            });

        // 🔹 Configura o filtro
        this.atendimentosDataSource.filterPredicate = (
            data: AtendimentoCompleto,
            filter: string
        ) => {
            return (
                data.paciente?.nome?.toLowerCase().includes(filter) ||
                data.usuario?.pessoa?.nome?.toLowerCase().includes(filter)
            );
        };

        // 🔹 Inicializa sort e paginator
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

    gerarRelatorios(): void {
        if (!this.pacienteId) {
            notyf.error('Paciente não identificado.');
            return;
        }

        const { dataInicio, dataFim } = this.filtroForm.value;

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
}
