import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from './translate-loader';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, TranslatePipe],
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
})
export class LanguageSwitcher {
  protected readonly translate = inject(TranslateService);
  protected readonly languages = SUPPORTED_LANGUAGES;

  protected switchLanguage(lang: SupportedLanguage): void {
    this.translate.use(lang);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  }
}
