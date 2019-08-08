import { Component, OnInit, forwardRef, ViewChild, ElementRef, Renderer2, Input, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, FormBuilder } from '@angular/forms';

const emailCheck = (email: string)  => {
  // tslint:disable-next-line: max-line-length
  const  re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const customValidators = (maxLength: number, onlyNumber: boolean = false, email = false) => {
  return (control: FormControl) => {

    const errors = {} as any;
    if (control && control.value && onlyNumber && isNaN(control.value)) {
      errors.onlyNumbers = true;
    }

    if (maxLength && control && control.value && control.value.length > maxLength) {
      errors.maxLength = true;
    }

    if (control && control.value && email && !emailCheck(control.value)) {
      errors.email = true;
    }
    return Object.keys(errors).length ? errors : null;
  };
};



@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [  { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CustomInputComponent), multi: true},
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CustomInputComponent), multi: true }]
})
export class CustomInputComponent implements ControlValueAccessor, OnInit, OnChanges {

  constructor(private renderer: Renderer2) {

  }

  validateFn: (control: FormControl) => void;
  @Input() errorMessages: any;
  @ViewChild('mainInput') mainInput: ElementRef;
  onChange: (_: any) => {};
  @Input() maxLength: number = undefined;
  @Input() onlyNumbers = false;
  control: FormControl;
  @Input() showError = false;
  @Input() email = false;

  @Input() placeHolder: string;


  onTouchFn = () => {};

  writeValue(obj: any): void {
    const input = this.mainInput.nativeElement;
    this.renderer.setValue(input, obj);
  }

  registerOnChange(fn: any): void {
  this.onChange = fn;
  }

  ngOnChanges(changes) {
    this.validateFn = customValidators(this.maxLength, this.onlyNumbers, this.email);

  }

  ngOnInit() {
    this.validateFn = customValidators(this.maxLength, this.onlyNumbers, this.email);
  }


  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  validate(c: FormControl) {
    this.control = c;
    return this.validateFn(c);
  }

  change($event: any) {
    this.onChange($event.target.value);
  }

  hasError(errorName: string): boolean {
    if (this.control && this.showError && this.control.hasError(errorName) && this.errorMessages[errorName]) {
      return true;
    }

    return false;
  }

  get errorMessage() {
    let errorMessage = '';
    Object.keys(this.errorMessages).forEach(key => {
      if (this.control && this.showError && this.control.hasError(key) && this.errorMessages[key]) {
        errorMessage = errorMessage + this.errorMessages[key];
      }
    });

    return errorMessage;
  }

}


