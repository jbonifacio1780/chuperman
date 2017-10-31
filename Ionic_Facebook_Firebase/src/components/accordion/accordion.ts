import { Component,ViewChild, OnInit, Renderer } from '@angular/core';

/**
 * Generated class for the AccordionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'accordion',
  templateUrl: 'accordion.html'
})
export class AccordionComponent implements OnInit {

  //text: string;
  accordionExpanded=false;
  @ViewChild("cc") cardContent: any;

  constructor(public renderer: Renderer) {
    
    
  }

  ngOnInit(){
    console.log(this.cardContent.nativeElement);
    this.renderer.setElementStyle(this.cardContent.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
  }

  toggleAccordion(){
    if(this.accordionExpanded){
      this.renderer.setElementStyle(this.cardContent.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent.nativeElement,"padding","0px 16 px");
    }else{
      this.renderer.setElementStyle(this.cardContent.nativeElement,"max-height","500px");
      this.renderer.setElementStyle(this.cardContent.nativeElement,"padding","0px 16 px");
    }

    this.accordionExpanded=!this.accordionExpanded;
  }

}
