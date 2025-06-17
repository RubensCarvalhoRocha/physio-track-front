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

    constructor(
        private _activatedRouter: ActivatedRoute,
        private _pessoaService: PessoaService,
        private fb: FormBuilder,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._activatedRouter.data.subscribe((data) => {
            this.pessoa = data['PessoaResolver'];
            this.isEditMode = !!(this.pessoa && this.pessoa.id);

            // Extrai valores normalizados para o form
            const cidadeNome = this.pessoa?.endereco?.cidade?.nome || '';
            const estadoId = this.pessoa?.endereco?.cidade?.estado?.id || null;

            // Lista os estados primeiro
            this._pessoaService.listarEstados().subscribe((estados) => {
                this.estados = estados;

                // Se houver estado no modo de edição, carrega as cidades antes de montar o form
                if (estadoId) {
                    const estado = estados.find((e) => e.id === estadoId);
                    if (estado?.sigla) {
                        this._pessoaService
                            .listarCidadesPorEstado(estado.sigla)
                            .subscribe((cidades) => {
                                this.cidades = cidades;

                                // Agora sim, monta o formulário com cidades carregadas
                                this.buildForm(estadoId, cidadeNome);
                            });
                        return;
                    }
                }

                // Caso não haja estadoId ou não seja edição, monta o formulário direto
                this.buildForm(null, '');
            });
        });
    }

    private buildForm(estadoId: number | null, cidadeNome: string): void {
        this.pessoaForm = this.fb.group({
            nome: [this.pessoa?.nome || '', Validators.required],
            cpf: [this.pessoa?.cpf || ''],
            telefone: [this.pessoa?.telefone || ''],
            endereco: this.fb.group({
                rua: [this.pessoa?.endereco?.rua || ''],
                cep: [this.pessoa?.endereco?.cep || ''],
                cidade: [cidadeNome, Validators.required],
                estadoId: [estadoId, Validators.required],
            }),
        });

        // Escuta alterações no estado para carregar novas cidades
        this.pessoaForm
            .get('endereco.estadoId')
            ?.valueChanges.subscribe((novoEstadoId) => {
                const estado = this.estados.find((e) => e.id === +novoEstadoId);
                if (estado?.sigla) {
                    this.carregarCidades(estado.sigla);
                    this.pessoaForm.get('endereco.cidade')?.setValue('');
                }
            });
    }

    carregarCidades(uf: string): void {
        this._pessoaService.listarCidadesPorEstado(uf).subscribe((cidades) => {
            this.cidades = cidades;

            const cidadeNome = this.pessoaForm?.get('endereco.cidade')?.value;
            if (cidadeNome) {
                const cidadeExiste = this.cidades.some(
                    (c) => c.nome === cidadeNome
                );
                if (cidadeExiste) {
                    // Reatribui o valor após carregar as opções
                    this.pessoaForm
                        .get('endereco.cidade')
                        ?.setValue(cidadeNome);
                }
            }
        });
    }

    validarCPF(): void {
        const cpfControl = this.pessoaForm.get('cpf');
        const cpf = cpfControl?.value || '';

        if (!validarCPF(cpf)) {
            cpfControl?.setValue(null); // Limpa o campo
            notyf.open({
                type: 'warning',
                message: 'CPF inválido.',
            });
        }
    }

    salvar(): void {
        const pessoaData: Pessoa = {
            ...this.pessoa,
            ...this.pessoaForm.value,
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
