import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from 'app/models/pessoa';
import { Estado } from 'app/models/estado';
import { Cidade } from 'app/models/cidade';

@Injectable({
    providedIn: 'root',
})
export class PessoaService {
    private _pessoas = new BehaviorSubject<Pessoa[]>([]);

    constructor(private _httpClient: HttpClient) {}

    get pessoas$(): Observable<Pessoa[]> {
        return this._pessoas.asObservable();
    }

    listarPessoas(): Observable<Pessoa[]> {
        return this._httpClient
            .get<Pessoa[]>(`${environment.api}/api/pessoa`)
            .pipe(
                tap((response) => {
                    this._pessoas.next(response);
                })
            );
    }

    obterPessoa(id: string): Observable<Pessoa> {
        return this._httpClient.get<Pessoa>(`${environment.api}/pessoa/${id}`);
    }

    cadastrarPessoa(pessoa: Pessoa): Observable<Pessoa> {
        return this._httpClient
            .post<Pessoa>(`${environment.api}/api/pessoa/register`, pessoa)
            .pipe(
                tap((createdPessoa) => {
                    // Opcional: atualizar lista de pessoas localmente, se você quiser
                    this.listarPessoas().subscribe();
                })
            );
    }

    atualizarPessoa(id: number, pessoa: Pessoa): Observable<Pessoa> {
        return this._httpClient
            .put<Pessoa>(`${environment.api}api/pessoa/${id}`, pessoa)
            .pipe(
                tap((updatedPessoa) => {
                    // Opcional: atualizar lista de pessoas localmente, se você quiser
                    this.listarPessoas().subscribe();
                })
            );
    }

    excluirPessoa(id: number): Observable<void> {
        return this._httpClient
            .delete<void>(`${environment.api}/api/pessoa/${id}`)
            .pipe(
                tap(() => {
                    // Atualiza a lista após exclusão
                    this.listarPessoas().subscribe();
                })
            );
    }

    listarEstados(): Observable<Estado[]> {
        return this._httpClient.get<Estado[]>(`${environment.api}/api/estado`);
    }

    listarCidadesPorEstado(uf: string): Observable<Cidade[]> {
        return this._httpClient.get<Cidade[]>(
            `${environment.api}/api/cidade/ibge/${uf}`
        );
    }
}
