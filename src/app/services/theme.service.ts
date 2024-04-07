import { Injectable } from '@angular/core';

export enum ThemeMode {
  Light = 'Light',
  Dark = 'Dark'
}

abstract class Theme {
  abstract applyTheme(): void;
  abstract id: ThemeMode;
}

export class LightTheme extends Theme {
  isDefault = true;

  applyTheme() {
    document.documentElement.style.setProperty(
      '--bodyBackgroundColor',
      'var(--tomatoOrange)'
    );
    document.documentElement.style.setProperty(
      '--buttonsBackgroundColor',
      'var(--englishVioletPurple)'
    );
    document.documentElement.style.setProperty(
      '--headingColor',
      'var(--black)'
    );
    document.documentElement.style.setProperty(
      '--paragraphColor',
      'var(--black)'
    );
  }
  id = ThemeMode.Light;
}

export class DarkTheme extends Theme {
  applyTheme() {
    document.documentElement.style.setProperty(
      '--bodyBackgroundColor',
      'var(--englishVioletPurple)'
    );
    document.documentElement.style.setProperty(
      '--buttonsBackgroundColor',
      'var(--tomatoOrange)'
    );
    document.documentElement.style.setProperty(
      '--headingColor',
      'var(--white)'
    );
    document.documentElement.style.setProperty(
      '--paragraphColor',
      'var(--white)'
    );
  }
  id = ThemeMode.Dark;
}


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  currentTheme: Theme = new LightTheme();

  constructor() { }

  getCurrentTheme() {
    return this.currentTheme;
  }

  updateTheme(theme: LightTheme): LightTheme;
  updateTheme(theme: DarkTheme): DarkTheme;
  updateTheme<T extends Theme>(theme: T): T {
    theme.applyTheme();
    this.currentTheme = theme;
    return theme;
  }

}
