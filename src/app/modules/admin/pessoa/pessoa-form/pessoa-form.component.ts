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
        this._pessoaService.listarEstados().subscribe((estados) => {
            this.estados = estados;

            // Carrega cidades se houver estado preenchido no modo de edição
            const estadoId = this.pessoa?.endereco?.estadoId;
            const estado = estados.find((e) => e.id === estadoId);
            if (estado) {
                this.carregarCidades(estado.sigla);
            }
        });

        this._activatedRouter.data.subscribe((data) => {
            this.pessoa = data['PessoaResolver'];
            this.isEditMode = !!(this.pessoa && this.pessoa.id);

            this.pessoaForm = this.fb.group({
                nome: [this.pessoa?.nome || '', Validators.required],
                cpf: [this.pessoa?.cpf || ''],
                telefone: [this.pessoa?.telefone || ''],
                email: [this.pessoa?.email || '', [Validators.required, Validators.email]],
                endereco: this.fb.group({
                    rua: [this.pessoa?.endereco?.rua || ''],
                    cep: [this.pessoa?.endereco?.cep || ''],
                    cidade: [
                        this.pessoa?.endereco?.cidade || '',
                        Validators.required,
                    ],
                    estadoId: [
                        this.pessoa?.endereco?.estadoId || null,
                        Validators.required,
                    ],
                }),
            });

            // Detecta mudança no estado para carregar cidades
            this.pessoaForm
                .get('endereco.estadoId')
                ?.valueChanges.subscribe((estadoId) => {
                    const estado = this.estados.find((e) => e.id === +estadoId);
                    if (estado?.sigla) {
                        this.carregarCidades(estado.sigla);
                        // Limpa cidade selecionada ao mudar o estado
                        this.pessoaForm.get('endereco.cidade')?.setValue('');
                    }
                });
        });
    }

    carregarCidades(uf: string): void {
        this._pessoaService.listarCidadesPorEstado(uf).subscribe((cidades) => {
            this.cidades = cidades;
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
                    notyf.success('Paciente cadastrado com sucesso, senha enviada para o email do paciente!');
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
