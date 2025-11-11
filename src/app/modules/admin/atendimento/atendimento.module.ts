import { AtendimentoListComponent } from './atendimento-list/atendimento-list.component';
import { AtendimentoFormComponent } from './atendimento-form/atendimento-form.component';
import { atendimentoRoutes } from './atendimento.routing';
import { SharedModule } from 'app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AvaliacaoFormComponent } from './avaliacao-form/avaliacao-form.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { RelatorioModalComponent } from './relatorio-modal/relatorio-modal.component';
import { AnaliseModalComponent } from './analise-modal/analise-modal.component';

@NgModule({
    declarations: [AtendimentoFormComponent, AtendimentoListComponent, AvaliacaoFormComponent, RelatorioModalComponent, AnaliseModalComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(atendimentoRoutes),
        SharedModule,
        MatExpansionModule
    ],
})
export class AtendimentoModule {}
