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
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        AtendimentoFormComponent,
        AtendimentoListComponent,
        AvaliacaoFormComponent,
        RelatorioModalComponent,
        AnaliseModalComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(atendimentoRoutes),
        SharedModule,
        MatExpansionModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
    ],
})
export class AtendimentoModule {}
