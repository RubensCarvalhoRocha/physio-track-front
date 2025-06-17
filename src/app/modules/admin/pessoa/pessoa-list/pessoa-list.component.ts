import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PessoaService } from '../pessoa.service';
import { MatSort } from '@angular/material/sort';
import { Pessoa } from 'app/models/pessoa';
import { Router } from '@angular/router';
import notyf from 'app/utils/utils';

@Component({
    selector: 'app-pessoa-list',
    templateUrl: './pessoa-list.component.html',
    styleUrls: ['./pessoa-list.component.scss'],
})
export class PessoaListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    pessoasDataSource = new MatTableDataSource<Pessoa>();
    pessoasOriginais: Pessoa[] = [];
    pessoasTableColumns: string[] = ['nome', 'cpf', 'telefone', 'acoes'];

    constructor(
        private _pessoaService: PessoaService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._pessoaService.pessoas$.subscribe((data) => {
            this.pessoasOriginais = data;
            this.pessoasDataSource.data = data;
        });

        this.pessoasDataSource.filterPredicate = (
            data: Pessoa,
            filter: string
        ) => {
            return data.nome?.toLowerCase().includes(filter);
        };

        setTimeout(() => {
            this.pessoasDataSource.sort = this.sort;
            this.pessoasDataSource.paginator = this.paginator;
        });
    }

    filtrarPessoas(text: string) {
        this.pessoasDataSource.filter = text.trim().toLowerCase();
    }

    cadastrarAtendimento(pessoaId: number): void {
        this._router.navigate(['/atendimento', 'novo', pessoaId]);
    }

    excluirPessoa(id: number): void {
        if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
            this._pessoaService.excluirPessoa(id).subscribe({
                next: () => {
                    notyf.success('Pessoa excluída com sucesso!');
                },
                error: () => {
                    notyf.error('Erro ao excluir a pessoa.');
                },
            });
        }
    }
}
