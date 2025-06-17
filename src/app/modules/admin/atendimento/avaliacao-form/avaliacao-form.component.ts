import { AvaliacaoRequestDTO } from 'app/models/interfaces/AvaliacaoRequestDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AtendimentoService } from '../atendimento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import notyf from 'app/utils/utils';

@Component({
    selector: 'app-avaliacao-form',
    templateUrl: './avaliacao-form.component.html',
})
export class AvaliacaoFormComponent implements OnInit {
    avaliacaoForm!: FormGroup;
    idAtendimento!: number;
    isEditMode = false;
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private _atendimentoService: AtendimentoService
    ) {}

    ngOnInit(): void {
        this.idAtendimento =
            +this.route.snapshot.paramMap.get('idAtendimento')!;

        this.avaliacaoForm = this.fb.group({
            altura: [null],
            peso: [null],
            imc: [null],

            esporte: [''],
            queixas: [''],
            historicoSaude: [''],
            medicamentos: [''],
            cirurgia: [''],
            tratamentoAnterior: [''],
            exameImagem: [''],
            diagnosticoMedico: [''],
            objTratamento: [''],
            obsGerais: [''],

            perimetriaMedida1D: [null],
            perimetriaMedida2D: [null],
            perimetriaMedida3D: [null],
            perimetriaPanturrilhaD: [null],

            perimetriaAssimetriaMedida1E: [null],
            perimetriaAssimetriaMedida2E: [null],
            perimetriaAssimetriaMedida3E: [null],
            perimetriaPanturrilhaE: [null],

            perimetriaMedidaAss1: [null],
            perimetriaMedidaAss2: [null],
            perimetriaMedidaAss3: [null],
            perimetriaPanturrilhaAss: [null],

            lungeD: [null],
            lungeE: [null],
            lungeAss: [null],

            rotQuadInterD: [null],
            rotQuadInterE: [null],
            rotQuadInterAss: [null],

            rotQuadExterD: [null],
            rotQuadExterE: [null],
            rotQuadExterAss: [null],

            extJoelhoD: [null],
            extJoelhoE: [null],
            extJoelhoAss: [null],

            flexJoelhoD: [null],
            flexJoelhoE: [null],
            flexJoelhoAss: [null],

            shTest1D: [null],
            shTest2D: [null],
            shTest3D: [null],
            shTestMediaD: [null],

            shTest1E: [null],
            shTest2E: [null],
            shTest3E: [null],
            shTestMediaE: [null],

            shTestScore: [null],
            slbTestD: [null],
            slbTestE: [null],
        });

        // carregar dados se modo edição for implementado depois
    }

    salvar(): void {
        if (this.avaliacaoForm.invalid) return;

        const dto: AvaliacaoRequestDTO = this.avaliacaoForm.getRawValue();
        this._atendimentoService
            .cadastrarAvaliacao(this.idAtendimento, dto)
            .subscribe({
                next: () => {
                    notyf.success('Avaliação salva com sucesso!');
                    this.router.navigate(['/atendimento']);
                },
                error: () => {
                    notyf.error('Erro ao salvar avaliação.');
                },
            });
    }

    cancelar(): void {
        this.router.navigate(['/atendimento']);
    }
}
