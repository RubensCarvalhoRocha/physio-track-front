import { PessoaListComponent } from './pessoa-list/pessoa-list.component';
import { PessoaFormComponent } from './pessoa-form/pessoa-form.component';
import { SharedModule } from 'app/shared/shared.module';
import { pessoaRoutes } from './pessoa.routing';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [PessoaListComponent, PessoaFormComponent],
    imports: [CommonModule, RouterModule.forChild(pessoaRoutes), SharedModule],
})
export class PessoaModule {}
