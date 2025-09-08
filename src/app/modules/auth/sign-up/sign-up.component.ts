import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    NgForm,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import notyf from 'app/utils/utils';
import { validarCPF } from 'app/utils/validarCPF';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private _router: Router,
        private _http: HttpClient
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.signUpForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            pessoa: this._formBuilder.group({
                nome: ['', Validators.required],
                cpf: ['', Validators.required],
                telefone: ['', Validators.required],
                endereco: this._formBuilder.group({
                    cep: ['', Validators.required],
                    rua: [{ value: '', disabled: true }, Validators.required],
                    bairro: [{ value: '', disabled: true }, Validators.required],
                    localidade: [{ value: '', disabled: true }, Validators.required],
                    uf: [{ value: '', disabled: true }, Validators.required],
                }),
            }),
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Busca CEP no backend
     */
    buscarCep(): void {
        const cep = this.signUpForm.get('pessoa.endereco.cep')?.value;

        if (!cep) {
            return;
        }

        this._http.get<any>(`http://localhost:8080/api/cep/${cep}`).subscribe({
            next: (dados) => {
                if (dados?.cep) {
                    this.signUpForm.patchValue({
                        pessoa: {
                            endereco: {
                                rua: dados.logradouro,
                                bairro: dados.bairro,
                                localidade: dados.localidade,
                                uf: dados.uf,
                            },
                        },
                    });
                } else {
                    notyf.open({
                        type: 'warning',
                        message: 'CEP não encontrado.',
                    });
                }
            },
            error: () => {
                notyf.open({
                    type: 'error',
                    message: 'Erro ao buscar CEP.',
                });
            },
        });
    }

    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        const userData = this.signUpForm.getRawValue();
        console.log('Payload enviado:', userData);

        // Sign up
        this._authService.signUp(userData).subscribe(
            (response) => {
                notyf.success('Cadastro realizado com sucesso!');
                this._router.navigateByUrl('/sign-in');
            },
            (response) => {
                // Re-enable the form
                this.signUpForm.enable();

                // Reset the form
                this.signUpNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Something went wrong, please try again.',
                };

                // Show the alert
                this.showAlert = true;
            }
        );
    }

    validarCPF(): void {
        const cpfControl = this.signUpForm.get('pessoa.cpf');
        const cpf = cpfControl?.value || '';

        if (!validarCPF(cpf)) {
            cpfControl?.setValue(null); // Limpa o campo
            notyf.open({
                type: 'warning',
                message: 'CPF inválido.',
            });
        }
    }
}
