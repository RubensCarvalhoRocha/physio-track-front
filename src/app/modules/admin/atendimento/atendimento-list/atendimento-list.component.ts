import { AtendimentoCompleto } from 'app/models/atendimentoCompleto';
import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AtendimentoService } from '../atendimento.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import notyf from 'app/utils/utils';

@Component({
    selector: 'app-atendimento-list',
    templateUrl: './atendimento-list.component.html',
    styleUrls: ['./atendimento-list.component.scss'],
})
export class AtendimentoListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('searchField') searchField!: ElementRef<HTMLInputElement>; // 👈 referência ao input

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
        private _router: Router,
        private _route: ActivatedRoute // 👈 para acessar query params
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

        // 👇 escuta o query param "nome" e aplica o filtro automaticamente
        this._route.queryParams.subscribe((params) => {
            const nome = params['nome'];
            if (nome) {
                setTimeout(() => {
                    if (this.searchField) {
                        this.searchField.nativeElement.value = nome;
                    }
                    this.filtrar(nome);

                    // opcional: limpa os params da URL após aplicar
                    this._router.navigate([], { queryParams: {} });
                });
            }
        });


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

                if (
                    err?.error instanceof Blob &&
                    err.error.type === 'application/json'
                ) {
                    const text = await err.error.text();
                    try {
                        const json = JSON.parse(text);
                        mensagem = json?.message || mensagem;
                    } catch (e) {}
                }

                notyf.error(mensagem);
            },
        });
    }
}
