import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PessoaService } from '../pessoa.service';
import { Component, OnInit } from '@angular/core';
import { Pessoa } from 'app/models/pessoa';
import notyf from 'app/utils/utils';

@Component({
    selector: 'app-pessoa-form',
    templateUrl: './pessoa-form.component.html',
    styleUrls: ['./pessoa-form.component.scss'],
})
export class PessoaFormComponent implements OnInit {
    pessoaForm!: FormGroup;
    pessoa?: Pessoa;
    isEditMode = false;

    constructor(
        private fb: FormBuilder,
        private _activatedRouter: ActivatedRoute,
        private _router: Router,
        private pessoaService: PessoaService
    ) {}

    ngOnInit(): void {
        this._activatedRouter.data.subscribe((data) => {
            this.pessoa = data['PessoaResolver'];
            this.isEditMode = !!(this.pessoa && this.pessoa.id);

            this.pessoaForm = this.fb.group({
                nome: [this.pessoa?.nome || '', Validators.required],
                cpf: [this.pessoa?.cpf || ''],
                telefone: [this.pessoa?.telefone || ''],
                endereco: this.fb.group({
                    rua: [this.pessoa?.endereco?.rua || ''],
                    cep: [this.pessoa?.endereco?.cep || ''],
                    cidade: [this.pessoa?.endereco?.cidade || ''],
                    estadoId: [this.pessoa?.endereco?.estadoId || null],
                }),
            });
        });
    }

    salvar(): void {
        const pessoaData: Pessoa = {
            ...this.pessoa,
            ...this.pessoaForm.value,
        };

        if (this.isEditMode && this.pessoa?.id) {
            this.pessoaService
                .atualizarPessoa(this.pessoa.id, pessoaData)
                .subscribe({
                    next: () => {
                        notyf.success('Pessoa atualizada com sucesso!');
                        this._router.navigate(['/pessoa']);
                    },
                    error: () => {
                        notyf.error('Erro ao atualizar a pessoa.');
                    },
                });
        } else {
            this.pessoaService.cadastrarPessoa(pessoaData).subscribe({
                next: () => {
                    notyf.success('Pessoa cadastrada com sucesso!');
                    this._router.navigate(['/pessoa']);
                },
                error: () => {
                    notyf.error('Erro ao cadastrar a pessoa.');
                },
            });
        }
    }

    cancelar(): void {
        this._router.navigate(['/pessoas']);
    }
}
