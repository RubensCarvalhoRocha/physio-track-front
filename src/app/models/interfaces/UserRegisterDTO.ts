import { PessoaRequestDTO } from './PessoaRequestDTO';

export interface UserRegisterDTO {
    email: string;
    password: string;
    pessoa: PessoaRequestDTO;
}
