import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '../../../i18n/language-switcher';
import { NoteStore } from '../../note-store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LanguageSwitcher,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    RouterLink,
    TranslatePipe,
  ],
  selector: 'app-note-page',
  styleUrl: './note-page.css',
  templateUrl: './note-page.html',
})
export class NotePage implements OnInit {
  protected readonly store = inject(NoteStore);

  ngOnInit(): void {
    void this.store.loadAll();
  }
}
