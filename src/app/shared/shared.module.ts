import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { IconsModule } from 'app/core/icons/icons.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { PipeModule } from 'app/pipe/pipe.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatTableModule,
        IconsModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        PipeModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatTableModule,
        IconsModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        PipeModule,
    ],
})
export class SharedModule {}
