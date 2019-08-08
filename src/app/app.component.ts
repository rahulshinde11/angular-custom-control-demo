import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(private fb: FormBuilder) {

  }
  title = 'custom-control';
  submitted = false;

  myForm: FormGroup;


  errorMessages = {
    onlyNumbers: 'Please enter only numbers.',
    maxLength: 'Please enter less than 10 chars.',
    email: 'Not a vaid email.'
  };

  ngOnInit() {
    this.myForm = this.fb.group({
      firstName: [],
      email: []
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.myForm);
  }
}
