import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PessoaService } from '../pessoa.service';
import { Component, OnInit } from '@angular/core';
import { Pessoa } from 'app/models/pessoa';
import notyf from 'app/utils/utils';
import { Estado } from 'app/models/estado';
import { Cidade } from 'app/models/cidade';
import { validarCPF } from 'app/utils/validarCPF';

@Component({
    selector: 'app-pessoa-form',
    templateUrl: './pessoa-form.component.html',
    styleUrls: ['./pessoa-form.component.scss'],
})
export class PessoaFormComponent implements OnInit {
    pessoaForm!: FormGroup;
    estados: Estado[] = [];
    cidades: Cidade[] = [];
    isEditMode = false;
    pessoa?: Pessoa;
    estadoNomeAtual: string = '';

    constructor(
        private _activatedRouter: ActivatedRoute,
        private _pessoaService: PessoaService,
        private fb: FormBuilder,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._pessoaService.listarEstados().subscribe((estados) => {
            this.estados = estados;

            const estadoId = this.pessoa?.endereco?.estadoId;
            const estado = estados.find((e) => e.id === estadoId);
            if (estado) {
                this.estadoNomeAtual = estado.nome;
            }
        });

        this._activatedRouter.data.subscribe((data) => {
            this.pessoa = data['PessoaResolver'];
            this.isEditMode = !!(this.pessoa && this.pessoa.id);

            this.pessoaForm = this.fb.group({
                nome: [this.pessoa?.nome || '', Validators.required],
                cpf: [this.pessoa?.cpf || ''],
                telefone: [this.pessoa?.telefone || ''],
                endereco: this.fb.group({
                    cep: [this.pessoa?.endereco?.cep || '', Validators.required],
                    rua: [{ value: this.pessoa?.endereco?.rua || '', disabled: true }],
                    cidade: [{ value: this.pessoa?.endereco?.cidade || '', disabled: true }],
                    estadoId: [{ value: this.pessoa?.endereco?.estadoId || null, disabled: true }],
                }),
            });
        });
    }

    buscarCep(): void {
        const cepControl = this.pessoaForm.get('endereco.cep');
        const cep = cepControl?.value || '';
        if (!cep) return;

        this._pessoaService.buscarCep(cep).subscribe({
            next: (dados) => {
                if (dados?.cep) {
                    const estadoId = this.getEstadoIdPorSigla(dados.uf);
                    const estadoNome = this.estados.find(e => e.id === estadoId)?.nome || '';

                    this.estadoNomeAtual = estadoNome;

                    this.pessoaForm.patchValue({
                        endereco: {
                            rua: dados.logradouro || '',
                            cidade: dados.localidade || '',
                            estadoId: estadoId,
                        },
                    });
                } else {
                    notyf.open({ type: 'warning', message: 'CEP não encontrado.' });
                }
            },
            error: () => {
                notyf.open({ type: 'error', message: 'Erro ao buscar CEP.' });
            },
        });
    }

    private getEstadoIdPorSigla(sigla: string): number | null {
        const estado = this.estados.find((e) => e.sigla === sigla);
        return estado ? estado.id : null;
    }

    validarCPF(): void {
        const cpfControl = this.pessoaForm.get('cpf');
        const cpf = cpfControl?.value || '';

        if (!validarCPF(cpf)) {
            cpfControl?.setValue(null);
            notyf.open({
                type: 'warning',
                message: 'CPF inválido.',
            });
        }
    }

    salvar(): void {
        const pessoaData: Pessoa = {
            ...this.pessoa,
            ...this.pessoaForm.getRawValue(),
        };

        if (this.isEditMode && this.pessoa?.id) {
            this._pessoaService
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
            this._pessoaService.cadastrarPessoa(pessoaData).subscribe({
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
        this._router.navigate(['/pessoa']);
    }
}
