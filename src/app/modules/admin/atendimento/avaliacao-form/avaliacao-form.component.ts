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
    idPaciente?: number;
    idAtendimento!: number;
    avaliacaoForm!: FormGroup;
    isEditMode = false;

    // 📏 PERIMETRIA
    perimetriaCampos = [
        { nome: 'perimetriaMedida1D', label: 'Medida 1 (Direita)' },
        { nome: 'perimetriaMedida2D', label: 'Medida 2 (Direita)' },
        { nome: 'perimetriaMedida3D', label: 'Medida 3 (Direita)' },
        { nome: 'perimetriaPanturrilhaD', label: 'Panturrilha (Direita)' },
        { nome: 'perimetriaAssimetriaMedida1E', label: 'Medida 1 (Esquerda)' },
        { nome: 'perimetriaAssimetriaMedida2E', label: 'Medida 2 (Esquerda)' },
        { nome: 'perimetriaAssimetriaMedida3E', label: 'Medida 3 (Esquerda)' },
        { nome: 'perimetriaPanturrilhaE', label: 'Panturrilha (Esquerda)' },
        { nome: 'perimetriaMedidaAss1', label: 'Assimetria 1' },
        { nome: 'perimetriaMedidaAss2', label: 'Assimetria 2' },
        { nome: 'perimetriaMedidaAss3', label: 'Assimetria 3' },
        { nome: 'perimetriaPanturrilhaAss', label: 'Panturrilha (Assimetria)' },
    ];

    // 🦵 LUNGE
    lungeCampos = [
        { nome: 'lungeD', label: 'Lunge (Direita) 1' },
        { nome: 'lungeE', label: 'Lunge (Esquerda) 1' },
        { nome: 'lungeAss', label: 'Lunge (Assimetria) 1' },
        { nome: 'lungeD2', label: 'Lunge (Direita) 2' },
        { nome: 'lungeE2', label: 'Lunge (Esquerda) 2' },
        { nome: 'lungeAss2', label: 'Lunge (Assimetria) 2' },
    ];

    // 🦾 ROTADORES DE QUADRIL
    quadrilCampos = [
        { nome: 'rotQuadInterD', label: 'Rotação Interna (Direita)' },
        { nome: 'rotQuadInterE', label: 'Rotação Interna (Esquerda)' },
        { nome: 'rotQuadInterAss', label: 'Assimetria Rot. Interna' },
        { nome: 'rotQuadExterD', label: 'Rotação Externa (Direita)' },
        { nome: 'rotQuadExterE', label: 'Rotação Externa (Esquerda)' },
        { nome: 'rotQuadExterAss', label: 'Assimetria Rot. Externa' },
    ];

    // 🦿 JOELHO
    joelhoCampos = [
        { nome: 'extJoelhoD', label: 'Extensão Joelho (Direita)' },
        { nome: 'extJoelhoE', label: 'Extensão Joelho (Esquerda)' },
        { nome: 'extJoelhoAss', label: 'Assimetria Extensão' },
        { nome: 'flexJoelhoD', label: 'Flexão Joelho (Direita)' },
        { nome: 'flexJoelhoE', label: 'Flexão Joelho (Esquerda)' },
        { nome: 'flexJoelhoAss', label: 'Assimetria Flexão' },
    ];

    // 🦶 SINGLE HOP
    singleHopCampos = [
        { nome: 'shTest1D', label: 'Salto 1 (Direita)' },
        { nome: 'shTest2D', label: 'Salto 2 (Direita)' },
        { nome: 'shTest3D', label: 'Salto 3 (Direita)' },
        { nome: 'shTestMediaD', label: 'Média (Direita)' },
        { nome: 'shTest1E', label: 'Salto 1 (Esquerda)' },
        { nome: 'shTest2E', label: 'Salto 2 (Esquerda)' },
        { nome: 'shTest3E', label: 'Salto 3 (Esquerda)' },
        { nome: 'shTestMediaE', label: 'Média (Esquerda)' },
        { nome: 'shTestScore', label: 'Score Total' },
    ];

    // 🏃 SIDE HOP
    sideHopCampos = [
        { nome: 'sdhTest1D', label: 'Salto Lateral 1 (Direita)' },
        { nome: 'sdhTest2D', label: 'Salto Lateral 2 (Direita)' },
        { nome: 'sdhTest3D', label: 'Salto Lateral 3 (Direita)' },
        { nome: 'sdhTestMediaD', label: 'Média (Direita)' },
        { nome: 'sdhTest1E', label: 'Salto Lateral 1 (Esquerda)' },
        { nome: 'sdhTest2E', label: 'Salto Lateral 2 (Esquerda)' },
        { nome: 'sdhTest3E', label: 'Salto Lateral 3 (Esquerda)' },
        { nome: 'sdhTestMediaE', label: 'Média (Esquerda)' },
        { nome: 'sdhTestScore', label: 'Score Total' },
    ];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private _router: Router,
        private _atendimentoService: AtendimentoService
    ) {}

    ngOnInit(): void {
        this.idAtendimento =
            +this.route.snapshot.paramMap.get('idAtendimento')!;
        this.idPaciente = +this.route.snapshot.paramMap.get('idPaciente')!;

        this.avaliacaoForm = this.fb.group({
            // 🩺 ANAMNESE
            altura: [null],
            peso: [null],
            imc: [{ value: null, disabled: true }],
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

            // 📏 PERIMETRIA
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

            // 🦵 LUNGE
            lungeD: [null],
            lungeE: [null],
            lungeAss: [null],
            lungeD2: [null],
            lungeE2: [null],
            lungeAss2: [null],

            // 🦾 ADM ROTADORES DE QUADRIL
            rotQuadInterD: [null],
            rotQuadInterE: [null],
            rotQuadInterAss: [null],
            rotQuadExterD: [null],
            rotQuadExterE: [null],
            rotQuadExterAss: [null],

            // 🦿 JOELHO
            extJoelhoD: [null],
            extJoelhoE: [null],
            extJoelhoAss: [null],
            flexJoelhoD: [null],
            flexJoelhoE: [null],
            flexJoelhoAss: [null],

            // 🦶 SINGLE HOP
            shTest1D: [null],
            shTest2D: [null],
            shTest3D: [null],
            shTestMediaD: [null],
            shTest1E: [null],
            shTest2E: [null],
            shTest3E: [null],
            shTestMediaE: [null],
            shTestScore: [null],

            // 🏃 SIDE HOP
            sdhTest1D: [null],
            sdhTest2D: [null],
            sdhTest3D: [null],
            sdhTestMediaD: [null],
            sdhTest1E: [null],
            sdhTest2E: [null],
            sdhTest3E: [null],
            sdhTestMediaE: [null],
            sdhTestScore: [null],

            // 🧍 SINGLE LEG BRIDGE
            slbTestD: [null],
            slbTestE: [null],

            // 🗒️ OBSERVAÇÃO FINAL
            observacao: [''],
        });

        // 🔥 Atualiza IMC automaticamente quando altura ou peso mudar
        this.avaliacaoForm
            .get('altura')
            ?.valueChanges.subscribe(() => this.calcularIMC());
        this.avaliacaoForm
            .get('peso')
            ?.valueChanges.subscribe(() => this.calcularIMC());
    }

    salvar(): void {
        if (this.avaliacaoForm.invalid) return;

        const dto: AvaliacaoRequestDTO = this.avaliacaoForm.getRawValue();

        this._atendimentoService
            .cadastrarAvaliacao(this.idAtendimento, dto)
            .subscribe({
                next: () => {
                    notyf.success('Avaliação salva com sucesso!');
                    this._router.navigate([
                        '/atendimento/paciente',
                        this.idPaciente,
                    ]);
                },
                error: () => {
                    notyf.error('Erro ao salvar avaliação.');
                },
            });
    }

    private calcularIMC(): void {
        const altura = this.avaliacaoForm.get('altura')?.value;
        const peso = this.avaliacaoForm.get('peso')?.value;

        if (altura && peso) {
            const alturaMetros = altura / 100;
            const imc = peso / (alturaMetros * alturaMetros);
            this.avaliacaoForm
                .get('imc')
                ?.setValue(Number(imc.toFixed(2)), { emitEvent: false });
        } else {
            this.avaliacaoForm.get('imc')?.setValue(null, { emitEvent: false });
        }
    }

    cancelar(): void {
        this._router.navigate(['/atendimento/paciente', this.idPaciente]);
    }
}
