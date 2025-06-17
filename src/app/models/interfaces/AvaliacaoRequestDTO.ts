export interface AvaliacaoRequestDTO {
  data: string;

  altura: number;
  peso: number;
  imc: number;

  esporte: string;
  queixas: string;
  historicoSaude: string;
  medicamentos: string;
  cirurgia: string;
  tratamentoAnterior: string;
  exameImagem: string;
  diagnosticoMedico: string;
  objTratamento: string;
  obsGerais: string;

  perimetriaMedida1D: number;
  perimetriaMedida2D: number;
  perimetriaMedida3D: number;
  perimetriaPanturrilhaD: number;

  perimetriaAssimetriaMedida1E: number;
  perimetriaAssimetriaMedida2E: number;
  perimetriaAssimetriaMedida3E: number;
  perimetriaPanturrilhaE: number;

  perimetriaMedidaAss1: number;
  perimetriaMedidaAss2: number;
  perimetriaMedidaAss3: number;
  perimetriaPanturrilhaAss: number;

  lungeD: number;
  lungeE: number;
  lungeAss: number;

  rotQuadInterD: number;
  rotQuadInterE: number;
  rotQuadInterAss: number;

  rotQuadExterD: number;
  rotQuadExterE: number;
  rotQuadExterAss: number;

  extJoelhoD: number;
  extJoelhoE: number;
  extJoelhoAss: number;

  flexJoelhoD: number;
  flexJoelhoE: number;
  flexJoelhoAss: number;

  shTest1D: number;
  shTest2D: number;
  shTest3D: number;
  shTestMediaD: number;

  shTest1E: number;
  shTest2E: number;
  shTest3E: number;
  shTestMediaE: number;

  shTestScore: number;
  slbTestD: number;
  slbTestE: number;
}
