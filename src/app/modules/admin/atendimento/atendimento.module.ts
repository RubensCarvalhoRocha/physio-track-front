import { AtendimentoListComponent } from './atendimento-list/atendimento-list.component';
import { AtendimentoFormComponent } from './atendimento-form/atendimento-form.component';
import { atendimentoRoutes } from './atendimento.routing';
import { SharedModule } from 'app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AvaliacaoFormComponent } from './avaliacao-form/avaliacao-form.component';

@NgModule({
    declarations: [AtendimentoFormComponent, AtendimentoListComponent, AvaliacaoFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(atendimentoRoutes),
        SharedModule,
    ],
})
export class AtendimentoModule {}
