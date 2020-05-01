import { Component } from '@angular/core';
import { CommonService } from '../_service';
import { first } from 'rxjs/operators';
import { environment } from '../environments/environment';
import {IMyDrpOptions} from 'mydaterangepicker';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {IMyDpOptions} from 'mydatepicker';
import { OrderPipe } from 'ngx-order-pipe';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  order: string = 'city';
  reverse: boolean = false;
  toggle:boolean=false;
  title = 'app';
  list_status = false;
  is_editable = false;

  tblData = [];
  masterForm: FormGroup;
  action_title = 'Add New';
  m_city = '';
  m_price = '';
  m_start_date = '';
  m_end_date = '';
  m_status = '';
  m_color = '';
  m_city_id = 0;
  p: number = 1;
  total_page : number = 0;
  totalItems : number = 0;


  screen_api = environment.GET_DATA;
  screen_api_add = environment.ADD_NEW_CITY;
  screen_api_delete = environment.DELETE_ONE_CITY;
  screen_api_get_one = environment.GET_ONE_CITY;
  screen_api_update = environment.UPDATE_ONE_CITY;



  myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
};

public myDatePickerOptions: IMyDpOptions = {
  // other options...
  dateFormat: 'yyyy-mm-dd',
};
private myForm: FormGroup;
private start_date: any = {};
private end_date: any = {};
sorting = {
}
  constructor(private common: CommonService,private formBuilder: FormBuilder,private orderPipe: OrderPipe) { 
    this.postInfo(this.screen_api,{});

  }

  ngOnInit() {

      this.masterForm = this.formBuilder.group({
        city: [null, [Validators.required]],
        price: ['',[Validators.required]],
        start_date: ['',[Validators.required]],
        end_date: ['',[Validators.required]],
        status: ['',[Validators.required]],
        color: ['',[Validators.required]],

      });

  }


  postInfo(urlPath,data) {
    this.list_status = false;
    this.common.postInfo(urlPath,data).pipe(first()).subscribe((res: any) => {
      if(res.result.success) {
        this.list_status = true;
        this.tblData = res.data.results;
        this.totalItems = res.data.pagination.total
        console.log(this.tblData)
      }
    });
  }

  onSubmitNgModel(): void {
    console.log('Value: ', this.start_date, this.end_date);
    let temp_view: any = {};
    if(this.start_date.formatted || this.end_date.formatted){
      if(this.start_date.formatted){
        var start_date = this.start_date.formatted.split('-');
        var start_date_from = start_date[0].trim();
        var start_date_to = start_date[1].trim()
        temp_view.start_date_from = start_date_from;
        temp_view.start_date_to = start_date_to;
      }
      if(this.end_date.formatted){
        var end_date = this.end_date.formatted.split('-');
        var end_date_from = end_date[0].trim();
        var end_date_to = end_date_to[1].trim()
        temp_view.end_date_from = end_date_from;
        temp_view.start_date_to = start_date_to;
      }
      this.postInfo(this.screen_api,temp_view);
    } else {

    }
  }

  clear() {
    this.masterForm.reset();
    this.action_title = 'Add New';
    this.is_editable = false;

  }

  onSubmit() {
    console.log(this.masterForm.value)
    let temp_view: any = {};
    temp_view.city = this.masterForm.value.city;
    temp_view.status = this.masterForm.value.status;
    temp_view.price = this.masterForm.value.price;
    if(this.masterForm.value.start_date.formatted){
      temp_view.start_date = this.masterForm.value.start_date.formatted;
    } else {
      temp_view.start_date = `${this.masterForm.value.start_date.date.year}-${this.masterForm.value.start_date.date.month}-${this.masterForm.value.start_date.date.day}`

    }
    if(this.masterForm.value.end_date.formatted){
      temp_view.end_date = this.masterForm.value.end_date.formatted;
    } else {
      temp_view.end_date = `${this.masterForm.value.end_date.date.year}-${this.masterForm.value.end_date.date.month}-${this.masterForm.value.end_date.date.day}`
    }

    temp_view.color = this.masterForm.value.color;
    if(!this.is_editable){
      this.common.postInfo(this.screen_api_add,temp_view).pipe(first()).subscribe((res: any) => {
        if(res.result.success) {
          alert("City added successfully");
          this.clear();
          console.log(this.tblData)
        }
      });
    } else{
      temp_view.city_id = this.m_city_id;

      this.common.putInfo(this.screen_api_update,temp_view).pipe(first()).subscribe((res: any) => {
        if(res.result.success) {
          console.log("adsss",this.m_city_id)
          alert("City update successfully");
          this.clear();
          console.log(this.tblData)
        }
      });
    }

  }

  deleteCity(city_id){
    this.common.deleteInfo(`${this.screen_api_delete}?city_id=${city_id}`).pipe(first()).subscribe((res: any) => {
      if(res.result.success) {
        alert("City Deleted successfully");
        this.postInfo(this.screen_api,{});

        console.log(this.tblData)
      }
    });
  }

  editCity(city_id){
    this.common.getInfo(`${this.screen_api_get_one}?city_id=${city_id}`).pipe(first()).subscribe((res: any) => {
      if(res.result.success) {
        this.is_editable = true;
        this.action_title = "Update";
        var resData = res.data[0]
        console.log("res",resData,resData.city)
        this.masterForm.controls.city.setValue(resData.city)
        this.masterForm.controls.price.setValue(resData.price)
        this.masterForm.controls.status.setValue(resData.status)
        // this.masterForm.controls.start_date.setValue(resData.start_date)
        var s_date = resData.start_date.split('-');
        this.m_city_id = resData.id;
        this.masterForm.patchValue({start_date: {
          date: {
              year: parseInt(s_date[0]),
              month: parseInt(s_date[1]),
              day: parseInt(s_date[2])
            }
          }});
        this.masterForm.controls.end_date.setValue(resData.end_date)
        var e_date = resData.end_date.split('-');
        this.masterForm.patchValue({end_date: {
          date: {
              year: parseInt(e_date[0]),
              month: parseInt(e_date[1]),
              day: parseInt(e_date[2])
            }
          }});
          console.log("e_date",e_date)

        this.masterForm.controls.color.setValue(resData.color)
      }
    });
  }
  pageChanged(evt){
    var pageData = {
        
    }
    console.log(evt)
    this.p = evt;
    var data = {
      sorting : this.sorting,
      "npp" : 10,
      "page" : evt

    }
    this.postInfo(this.screen_api,data);

  }
  pageCounter(page, num) {
    if (page > 0) {
      let current = page - 1;
      current = current * 10 + num;
      return current;
    } else {
      return num;
    }
  }
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  sortData(col){
    console.log(col)
    if(this.sorting[col]){
      if(this.sorting[col] == "asc"){
        this.sorting[col] = "desc"
      }else {
        this.sorting[col] = "asc"

      }
    } else {
      this.sorting[col] = "desc"
    }
    if(!(Object.keys(this.sorting).length === 0) ){
      var data = {
        sorting : this.sorting
      }
      this.postInfo(this.screen_api,data);
    }
   
  }

}

