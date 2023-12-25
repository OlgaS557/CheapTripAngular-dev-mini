import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global/global.service';
import { HttpService } from '../service/http.service';
import { LOCALE_ID, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface Currency {
  name: string;
  code:string;
  oneEuroRate:number;
  r2rSymbol: string;
}

@Component({
  selector: 'app-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['./currency-selector.component.scss']
})
export class CurrencySelectorComponent implements OnInit {
  localesList = [
    { code: 'en-US', label: 'English', flag : 'us' },
    // { code: 'ru', label: 'Русский' , flag : 'ru'},
    // { code:'ua', label: 'Українська', flag : 'ua'}
  ]
  selectedLocale:any;
  selectedCurrency:Currency;
  currencies: Currency[];

  constructor(
    @Inject(DOCUMENT) private document,
    @Inject(LOCALE_ID) public globalLocale: string,
    private router: Router,
    private httpService: HttpService,
    private globalService: GlobalService
    ) {}
    
  ngOnInit(): void {
    this.selectedLocale = this.localesList[0];
    // this.localesList.forEach(element => {
    //   if (element.code==this.globalLocale){
    //     this.selectedLocale=element;
    //   }
    // });
    console.log("code found " + this.selectedLocale.code);
    
    this.httpService.getCurrencies().subscribe(data => {
      // console.log(data);
      // console.log("received currencies");
    
      // this.currencies=data.body;
      
     this.currencies= JSON.parse('[{"code":"EUR", "name":"Euro", "oneEuroRate":"1", "r2rSymbol":"€"}]')

      // this.currencies.sort(function(a, b){
      //   if (a.code=="EUR"){
      //     return -1;
      //   }
      //   if (a.code=="ILS" && b.code!="EUR"){
      //     return -1;
      //   }
      //   if (a.code=="USD" && b.code!="EUR"){
      //     return -1;
      //   }
      //   if (a.code=="RUB" && b.code!="EUR"){
      //     return -1;
      //   }
      //   if (a.code=="INR" && b.code!="EUR"){
      //     return -1;
      //   }
      //   if (a.code=="UAH" && b.code!="EUR"){
      //     return -1;
      //   }
      //   return 0;
      // });
      this.setSelectedCurrency()
      
      this.setGlobalCurrency();
    })
  }
  setNewLocale(){
    let href = this.router.url;
    // console.log(this.selectedLocale.code);
    // console.log(this.router.url);
    // console.log ("navigate to... "+this.selectedLocale.code+href);
  
      console.log(document.location);
   
    window.location.assign(document.location.protocol+'//'+document.location.host+'/'+this.selectedLocale.code+'/#/'+href);
  }

  private setSelectedCurrency(){
//     let savedCurrencyCode = this.globalService.getCurrencyFromLocalStorage();
   
    this.selectedCurrency=this.currencies[0];//euro is first
//  console.log("got from local "+ this.selectedCurrency);
//     this.currencies.forEach(element => {
//       if (element.code==savedCurrencyCode){
//         //found match
//         this.selectedCurrency=element;
//         console.log("found match "+this.selectedCurrency.name);
//         return;
//       }
    
//     });
  }

  setGlobalCurrency(){
    console.log("Set global "+this.selectedCurrency.name);
    this.globalService.setCurrency(this.selectedCurrency);
  }

}
