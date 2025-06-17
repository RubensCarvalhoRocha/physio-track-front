import { AtendimentoListComponent } from './atendimento-list/atendimento-list.component';
import { AtendimentoFormComponent } from './atendimento-form/atendimento-form.component';
import { Route } from '@angular/router';
import {
    AtendimentoResolver,
    AtendimentosResolver,
} from './atendimento.resolver';
import { AvaliacaoFormComponent } from './avaliacao-form/avaliacao-form.component';

export const atendimentoRoutes: Route[] = [
    {
        path: '',
        component: AtendimentoListComponent,
        resolve: {
            AtendimentosResolver,
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
        path: 'avaliacao/novo/:idAtendimento',
        component: AvaliacaoFormComponent,
    },
];
