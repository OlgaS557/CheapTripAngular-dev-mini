import { Meta } from '@angular/platform-browser';
import { HttpHeaders } from '@angular/common/http';

export class LinkCard {

    
        title: string;
        link:string;
        description:string;
        icolink:string;

        constructor(title:string,link:string,description:string){
                this.title=title;
                this.link=link;
                this.description=description;
                this.icolink = 'https://www.google.com/s2/favicons?domain='+link;
          

        }
   
}
