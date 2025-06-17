import { AtendimentoCompleto } from 'app/models/atendimentoCompleto';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { Atendimento } from 'app/models/atendimento';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AtendimentoService {
    private _atendimentos = new BehaviorSubject<AtendimentoCompleto[]>([]);

    constructor(private _httpClient: HttpClient) {}

    get atendimentos$(): Observable<AtendimentoCompleto[]> {
        return this._atendimentos.asObservable();
    }

    listarAtendimentos(): Observable<AtendimentoCompleto[]> {
        return this._httpClient
            .get<AtendimentoCompleto[]>(`${environment.api}/api/atendimento`)
            .pipe(
                tap((response) => {
                    this._atendimentos.next(response);
                })
            );
    }

    obterAtendimento(id: string): Observable<Atendimento> {
        return this._httpClient.get<Atendimento>(
            `${environment.api}/api/atendimento/${id}`
        );
    }

    cadastrarAtendimento(atendimento: Atendimento): Observable<Atendimento> {
        return this._httpClient
            .post<Atendimento>(
                `${environment.api}/api/atendimento/register`,
                atendimento
            )
            .pipe(
                tap(() => {
                    this.listarAtendimentos().subscribe();
                })
            );
    }

    atualizarAtendimento(
        id: number,
        atendimento: Atendimento
    ): Observable<Atendimento> {
        return this._httpClient
            .put<Atendimento>(
                `${environment.api}/api/atendimento/${id}`,
                atendimento
            )
            .pipe(
                tap(() => {
                    this.listarAtendimentos().subscribe();
                })
            );
    }
}
