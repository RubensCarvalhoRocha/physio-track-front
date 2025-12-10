import { AtendimentoListComponent } from './atendimento-list/atendimento-list.component';
import { AtendimentoFormComponent } from './atendimento-form/atendimento-form.component';
import { Route } from '@angular/router';
import {
    AtendimentoResolver,
    AtendimentosPorPacienteResolver,
    AtendimentosResolver,
} from './atendimento.resolver';
import { AvaliacaoFormComponent } from './avaliacao-form/avaliacao-form.component';
import { PacienteGuard } from 'app/core/auth/guards/paciente.guard';

export const atendimentoRoutes: Route[] = [
    {
        path: '',
        component: AtendimentoListComponent,
        resolve: {
            AtendimentosResolver,
        },
        canActivate: [PacienteGuard],
    },
    {
        path: 'paciente/:idPaciente',
        component: AtendimentoListComponent,
        resolve: {
            AtendimentosPorPacienteResolver,
        },
    },
    {
        path: ':idAtendimento',
        component: AtendimentoFormComponent,
        resolve: {
            AtendimentoResolver,
        },
    },
    {
        path: ':idAtendimento/:idPaciente',
        component: AtendimentoFormComponent,
        resolve: {
            AtendimentoResolver,
        },
    },
    {
        path: 'avaliacao/novo/:idAtendimento/:idPaciente',
        component: AvaliacaoFormComponent,
        canActivate: [PacienteGuard],
    },
];
