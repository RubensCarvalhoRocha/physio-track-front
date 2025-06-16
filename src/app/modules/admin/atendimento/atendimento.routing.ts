import { AtendimentoListComponent } from './atendimento-list/atendimento-list.component';
import { AtendimentoFormComponent } from './atendimento-form/atendimento-form.component';
import { Route } from '@angular/router';
import {
    AtendimentoResolver,
    AtendimentosResolver,
} from './atendimento.resolver';

export const atendimentoRoutes: Route[] = [
    {
        path: '',
        component: AtendimentoListComponent,
        resolve: {
            AtendimentosResolver,
        },
    },
    {
        path: ':idAtendimento/:idPaciente',
        component: AtendimentoFormComponent,
        resolve: {
            AtendimentoResolver,
        },
    },
];
