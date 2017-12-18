import { Component, OnInit } from '@angular/core';

interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-chanege-list',
  templateUrl: './chanege-list.component.html',
  styleUrls: ['./chanege-list.component.scss']
})
export class ChanegeListComponent implements OnInit {
  cities: City[];    
  selectedCity: City;
  displayDialog: boolean;

  

  constructor() { }

  ngOnInit() {
      this.cities = [
          {name: 'New York', code: 'NY'},
          {name: 'Rome', code: 'RM'},
          {name: 'London', code: 'LDN'},
          {name: 'Istanbul', code: 'IST'},
          {name: 'Paris', code: 'PRS'}
      ];
      
  }
    

}


