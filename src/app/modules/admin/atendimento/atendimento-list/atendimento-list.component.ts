import { AtendimentoCompleto } from 'app/models/atendimentoCompleto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AtendimentoService } from '../atendimento.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
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
}
