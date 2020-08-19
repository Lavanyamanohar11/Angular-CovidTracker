import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-data';
import { DateWiseData } from '../models/data-wise-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/08-10-2020.csv';
  private dateWiseDataUrl= 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

  constructor(private http: HttpClient) { }

  getDateWiseData(){
    return this.http.get(this.dateWiseDataUrl, {responseType: 'text'}).pipe(map(result => {
      let rows = result.split('\n');
      console.log(rows);
      let mainData = {};
      let header = rows[0];
      let dates = header.split(/,(?=\S)/);
      dates.splice(0,4);
      rows.splice(0,1);

      rows.forEach(row => {
        let cols = row.split(/,(?=\S)/);
        let con = cols[1];
        cols.splice(0,4);
        console.log(con,cols);
        mainData[con] = [];
        cols.forEach((value, index) => {
          let dw: DateWiseData = {
            cases: +value,
            country: con,
            date: new Date(Date.parse(dates[index]))
          }
          mainData[con].push(dw)
        })
      })

      return mainData;
    }));
  }

  getGlobalData(){
    return this.http.get(this.globalDataUrl, {responseType: 'text'}).pipe(
      map(result => {

        let data: GlobalDataSummary[] = [];
        let raw = {}
        let rows = result.split('\n');
        rows.splice(0, 1);
        // console.log(rows);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          // console.log(cols);

          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10]
          }
          
          let temp:GlobalDataSummary = raw[cs.country];
      
          if(temp){
            temp.active = temp.active + cs.active;
            temp.confirmed = temp.confirmed + cs.confirmed;
            temp.deaths = temp.deaths + cs.deaths;
            temp.recovered = temp.recovered + cs.recovered;
            raw[cs.country] = temp;
          }
          else{
            raw[cs.country] = cs;
          }
          
        })
       
        return <GlobalDataSummary[]>Object.values(raw);
        //41 min
      })
    ) 
  }
}
