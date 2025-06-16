import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AtendimentoService } from '../atendimento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Atendimento } from 'app/models/atendimento';
import { Component, OnInit } from '@angular/core';
import notyf from 'app/utils/utils';

@Component({
    selector: 'app-atendimento-form',
    templateUrl: './atendimento-form.component.html',
    styleUrls: ['./atendimento-form.component.scss'],
})
export class AtendimentoFormComponent implements OnInit {
    atendimentoForm!: FormGroup;
    atendimento?: Atendimento;
    isEditMode = false;

    constructor(
        private _atendimentoService: AtendimentoService,
        private _activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._activatedRoute.params.subscribe((params) => {
            const idPaciente = params['idPaciente'];
            const idAtendimento = params['idAtendimento'];

            this.isEditMode = idAtendimento !== 'novo';

            this.atendimentoForm = this.fb.group({
                pacienteId: [idPaciente, Validators.required],
                tipoAtendimento: ['', Validators.required],
                dataAtendimento: [null, Validators.required],
                descricao: [''],
            });

            if (this.isEditMode) {
                this._atendimentoService
                    .obterAtendimento(idAtendimento)
                    .subscribe((atendimento) => {
                        this.atendimentoForm.patchValue(atendimento);
                    });
            }
        });
    }

    salvar(): void {
        const atendimentoData: Atendimento = {
            ...this.atendimento,
            ...this.atendimentoForm.value,
        };

        if (this.isEditMode && this.atendimento?.id) {
            this._atendimentoService
                .atualizarAtendimento(this.atendimento.id, atendimentoData)
                .subscribe({
                    next: () => {
                        notyf.success('Atendimento atualizado com sucesso!');
                        this._router.navigate(['/atendimentos']);
                    },
                    error: () => {
                        notyf.error('Erro ao atualizar o atendimento.');
                    },
                });
        } else {
            this._atendimentoService
                .cadastrarAtendimento(atendimentoData)
                .subscribe({
                    next: () => {
                        notyf.success('Atendimento cadastrado com sucesso!');
                        this._router.navigate(['/atendimentos']);
                    },
                    error: () => {
                        notyf.error('Erro ao cadastrar o atendimento.');
                    },
                });
        }
    }

    cancelar(): void {
        this._router.navigate(['/atendimentos']);
    }
}
