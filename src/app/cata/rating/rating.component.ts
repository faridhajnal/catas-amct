import { Component, OnInit, OnChanges, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cata-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit, OnChanges {

  stars : any[] = new Array();
  @Input() category : string;
  @Input() subCategory : string;
  @Input() min : number;
  @Input() max : number;
  @Input() resetStars : number;
  @Output() ratingChanged = new EventEmitter<{rating:number, category:string, subcategory:string}>();
  constructor() {

   

   }

  ngOnInit() {
    for(let i = 0; i < this.max; i++){
      this.stars.push({
        selected : false
      });
    }
  }

  ngOnChanges(changes){
    if(!!changes.resetStars && changes.resetStars.currentValue !== 0){
      this.stars = [];
      for(let i = 0; i < this.max; i++){
        this.stars.push({
          selected : false
        });
      }
    }

  }

  handleStarClicked(index){
     const subCategory  = this.subCategory;
     const category = this.category;
     this.ratingChanged.emit({rating:index+1, category, subcategory:subCategory});
     for(let i = this.max-1; i >=0; i--){
       this.stars[i].selected = i <= index;
     }
  }

  shouldBeMarked(index:number){
    return index <= this.min;
  }

}
