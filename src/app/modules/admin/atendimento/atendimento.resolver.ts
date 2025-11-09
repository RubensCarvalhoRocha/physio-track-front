import { AtendimentoService } from './atendimento.service';
import { Atendimento } from 'app/models/atendimento';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AtendimentosResolver implements Resolve<Atendimento[]> {
    constructor(private _service: AtendimentoService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Atendimento[]> {
        return this._service.listarAtendimentos();
    }
}

@Injectable({ providedIn: 'root' })
export class AtendimentoResolver implements Resolve<Atendimento | null> {
    constructor(private _service: AtendimentoService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Atendimento | null> {
        const idAtendimento = route.paramMap.get('idAtendimento');

        if (idAtendimento === 'novo') {
            return of(null);
        }

        return this._service.obterAtendimento(idAtendimento!);
    }
}

@Injectable({
    providedIn: 'root',
})
export class AtendimentosPorPacienteResolver implements Resolve<Atendimento[]> {
    constructor(private _service: AtendimentoService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Atendimento[]> {
        const idPaciente = route.paramMap.get('idPaciente');

        if (idPaciente) {
            return this._service.listarAtendimentosPorPaciente(+idPaciente);
        }

        return this._service.listarAtendimentos();
    }
}
