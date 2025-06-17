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
import { Cidade } from 'app/models/cidade';
import { Estado } from 'app/models/estado';
import { PessoaService } from 'app/modules/admin/pessoa/pessoa.service';
import notyf from 'app/utils/utils';

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
    estados: Estado[] = [];
    cidades: Cidade[] = [];
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private _router: Router,
        private _pessoaService: PessoaService
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
                    rua: ['', Validators.required],
                    cep: ['', Validators.required],
                    estadoId: [null, Validators.required],
                    cidade: ['', Validators.required],
                }),
            }),
        });

        this._pessoaService.listarEstados().subscribe((estados) => {
            this.estados = estados;
        });

        this.signUpForm
            .get('pessoa.endereco.estadoId')
            ?.valueChanges.subscribe((estadoId) => {
                const estado = this.estados.find((e) => e.id === +estadoId);
                if (estado?.sigla) {
                    this.carregarCidades(estado.sigla);
                    this.signUpForm.get('pessoa.endereco.cidade')?.setValue('');
                }
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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

    carregarCidades(uf: string): void {
        this._pessoaService.listarCidadesPorEstado(uf).subscribe((cidades) => {
            this.cidades = cidades;
        });
    }
}
