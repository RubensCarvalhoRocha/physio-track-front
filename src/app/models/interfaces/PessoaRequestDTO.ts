import { EnderecoRequestDTO } from './EnderecoRequestDTO';

export interface PessoaRequestDTO {
    nome: string;
    cpf: string;
    telefone: string;
    endereco: EnderecoRequestDTO;
}
