import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { PessoaService } from './pessoa.service';
import { Pessoa } from 'app/models/pessoa';

@Injectable({
    providedIn: 'root',
})
export class PessoasResolver implements Resolve<Pessoa[]> {
    constructor(private _service: PessoaService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Pessoa[]> {
        return this._service.listarPessoas();
    }
}

@Injectable({
    providedIn: 'root',
})
export class PessoaResolver implements Resolve<Pessoa | null> {
    constructor(private _service: PessoaService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Pessoa | null> {
        const id = route.paramMap.get('id');

        // Se for 'nova', não buscar no backend → retorna null
        if (id === 'nova') {
            return of(null);
        }

        // Se for id real → buscar no backend
        return this._service.obterPessoa(id!);
    }
}
