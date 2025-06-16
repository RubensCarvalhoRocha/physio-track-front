import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CpfCnpjPipe } from './cpfCnpj/cpf-cnpj.pipe';
import { FormatarNomePipe } from './formatName/formatName.pipe';
import { PhonePipe } from './phone-pipe/phone.pipe';
import { RemoveUnderscorePipe } from './remove-underscore/remove-underscore.pipe';
import { SafePipe } from './safe/safe.pipe';
import { SafeHtmlPipe } from './safeHtml/safeHtml.pipe';
import { TruncatePipe } from './truncate/truncate.pipe';
import { TimeIntervalPipe } from './time-interval/time-interval.pipe';

@NgModule({
  declarations: [CpfCnpjPipe, PhonePipe, SafeHtmlPipe, SafePipe, RemoveUnderscorePipe, TruncatePipe, FormatarNomePipe, TimeIntervalPipe],
  imports: [CommonModule],
  exports: [CpfCnpjPipe, PhonePipe, SafeHtmlPipe, SafePipe, RemoveUnderscorePipe, TruncatePipe, FormatarNomePipe, TimeIntervalPipe],
})
export class PipeModule {}
