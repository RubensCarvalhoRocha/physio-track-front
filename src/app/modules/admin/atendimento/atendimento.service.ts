import { AtendimentoCompleto } from 'app/models/atendimentoCompleto';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { Atendimento } from 'app/models/atendimento';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AvaliacaoRequestDTO } from 'app/models/interfaces/AvaliacaoRequestDTO';

@Injectable({
    providedIn: 'root',
})
export class AtendimentoService {
    private _atendimentos = new BehaviorSubject<AtendimentoCompleto[]>([]);

    private _atendimentosPorPaciente = new BehaviorSubject<
        AtendimentoCompleto[]
    >([]);

    constructor(private _httpClient: HttpClient) {}

    get atendimentos$(): Observable<AtendimentoCompleto[]> {
        return this._atendimentos.asObservable();
    }

    get atendimentosPorPaciente$(): Observable<AtendimentoCompleto[]> {
        return this._atendimentosPorPaciente.asObservable();
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

    cadastrarAvaliacao(
        atendimentoId: number,
        dto: AvaliacaoRequestDTO
    ): Observable<void> {
        return this._httpClient.post<void>(
            `${environment.api}/api/avaliacao/register/${atendimentoId}`,
            dto
        );
    }

    gerarRelatorio(atendimentoId: number): Observable<Blob> {
        return this._httpClient.get(
            `${environment.api}/api/avaliacao/report/${atendimentoId}`,
            {
                responseType: 'blob',
            }
        );
    }

    gerarRelatorios(
        pacienteId: number,
        dataInicial?: string
    ): Observable<Blob> {
        const params: any = { pacienteId };

        if (dataInicial) {
            params.dataInicial = dataInicial; // formato ISO: 'YYYY-MM-DD'
        }

        return this._httpClient.get(
            `${environment.api}/api/avaliacao/reports`,
            {
                params,
                responseType: 'blob',
            }
        );
    }

    listarAtendimentosPorPaciente(
        idPaciente: number
    ): Observable<AtendimentoCompleto[]> {
        return this._httpClient
            .get<AtendimentoCompleto[]>(
                `${environment.api}/api/atendimento/atendimentos-paciente/${idPaciente}`
            )
            .pipe(
                tap((response) => {
                    // Atualiza o BehaviorSubject específico
                    this._atendimentosPorPaciente.next(response);
                })
            );
    }
}
