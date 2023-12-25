import {Injectable} from '@angular/core';
@Injectable()
export class Locale {
    constructor (){

    }

   public getUsersLocale(defaultValue: string): string {
        if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
          return defaultValue;
        }
        const wn = window.navigator as any;
        let lang = wn.languages ? wn.languages[0] : defaultValue;
        lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
        return lang;
      }


}