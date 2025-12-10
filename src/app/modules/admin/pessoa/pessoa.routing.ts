import { PessoaListComponent } from './pessoa-list/pessoa-list.component';
import { PessoaFormComponent } from './pessoa-form/pessoa-form.component';
import { Route } from '@angular/router';
import { PessoaResolver, PessoasResolver } from './pessoa.resolver';
import { PacienteGuard } from 'app/core/auth/guards/paciente.guard';

export const pessoaRoutes: Route[] = [
    {
        path: '',
        component: PessoaListComponent,
        resolve: {
            PessoasResolver,
        },
        canActivate: [PacienteGuard],
    },

    {
        path: ':id',
        component: PessoaFormComponent,
        resolve: {
            PessoaResolver,
        },
        canActivate: [PacienteGuard],
    },
];
