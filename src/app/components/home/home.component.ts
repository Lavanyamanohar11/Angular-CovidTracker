import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData : GlobalDataSummary[];
  datatable = [];
  chart = {
    PieChart: 'PieChart',
    ColumnChart: 'ColumnChart',
    height:500,
    options: {
      'Country': 'Cases',
       animation:{
        duration: 1000,
        easing: 'out'
      },
      is3D: true
    },
    
  }
  

  constructor(private dataService: DataServiceService) { }

  initChart(caseType: string){
 
    this.datatable = [];
    // this.datatable.push(["Country", "Cases"])
    this.globalData.forEach(cs => {
      let value: number;
      if(caseType == 'c'){
        if(cs.confirmed > 2000){
          value = cs.confirmed;
        }
      }
      if(caseType == 'a'){
        if(cs.active > 2000){
          value = cs.active;
        }
      }
      if(caseType == 'd'){
        if(cs.deaths > 2000){
          value = cs.deaths;
        }
      }
      if(caseType == 'r'){
        if(cs.recovered > 2000){
          value = cs.recovered;
        }
      }

      this.datatable.push([
        cs.country, value
      ])
      
    })

  }
  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      (result) => {
        console.log(result);
        this.globalData = result;

        result.forEach(cs => {
          if(!Number.isNaN(cs.confirmed)){
            this.totalActive+= cs.active;
            this.totalConfirmed +=cs.confirmed;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          }
        })

        this.initChart('c');
      }
    )
  }

  updateChart(input: HTMLInputElement){
    this.initChart(input.value);
  }

}
