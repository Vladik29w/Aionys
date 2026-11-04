import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANGUAGE } from './i18n/translate-loader';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  selector: 'app-root',
  template: '<router-outlet />',
})
export class App {
  private readonly translate = inject(TranslateService);
  private readonly title = inject(Title);

  constructor() {
    effect(() => {
      const lang =
        this.translate.currentLang() ?? this.translate.fallbackLang() ?? DEFAULT_LANGUAGE;
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', lang);
      }
      this.title.setTitle(this.translate.instant('notes.page.title'));
    });
  }
}
