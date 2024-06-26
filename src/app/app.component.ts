import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Icountry } from './shared/model/countryinterface';
import { COUNTRIES_META_DATA } from './shared/const/country';
import { CustomRegex } from './shared/const/validationpatt';
import { Nospacevalidator } from './shared/customvalidators/nospace';
import { emailValidator } from './shared/customvalidators/validemail';
import { EmpIdValidator } from './shared/customvalidators/empidvalidator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'myproject';
  hide = true;
  hideRequiredControl = new FormControl(false);
  signupform !: FormGroup;
  countries : Array<Icountry> = COUNTRIES_META_DATA; 

  ngOnInit(): void {
    this.onCreateform(),
    this.enableconfirmpass(),
    this.onconfirmpass(),
    this.curraddvalid(),
    this.patchcurraddress()
  }

  onCreateform(){
    this.signupform = new FormGroup({
      username : new FormControl(null, [Validators.required,
        Validators.pattern(CustomRegex.username),
        Validators.minLength(5),
        Validators.maxLength(9),
        Nospacevalidator.nospacecontrol
      ]),
      email : new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.email)],[emailValidator.isEmailValid]),
      password : new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.password)]),
      confirmpassword : new FormControl({value : null, disabled : true},[Validators.required,Validators.pattern(CustomRegex.password)]),
      skills : new FormArray([new FormControl(null, [Validators.required])]),
      empid : new FormControl(null, [Validators.required, EmpIdValidator.isempidvalid]),
      gender : new FormControl(null),
      currentaddress : new FormGroup({
        country : new FormControl(null, Validators.required),
        state : new FormControl(null, Validators.required),
        city : new FormControl(null, Validators.required),
        zipcode : new FormControl(null, Validators.required),
      }),
      permanentaddress : new FormGroup({
        country : new FormControl(null, Validators.required),
        state : new FormControl(null, Validators.required),
        city : new FormControl(null, Validators.required),
        zipcode : new FormControl(null, Validators.required),
      }),
      isaddSame : new FormControl({value: null, disabled: true})
    })
  }

  get skillarray(){
    return this.signupform.get('skills') as FormArray
  }

  get f(){
    return this.signupform.controls;
  }

  get username(){
    return this.signupform.get('username') as FormControl;

    //return this.signupform.controls['username']
  }

  enableconfirmpass(){
    this.f['password'].valueChanges
    .subscribe(res => {

      if(this.f['password'].valid){
        this.f['confirmpassword'].enable()
      }else{
        this.f['confirmpassword'].disable()
        this.f['confirmpassword'].reset()
      }
    })
  }

  curraddvalid(){
    this.f['currentaddress'].valueChanges.subscribe(res => {
      if(this.f['currentaddress'].valid){
        this.f['isaddSame'].enable()
      }else{
        this.f['isaddSame'].disable()
        this.f['isaddSame'].patchValue(false)
      }
    })
  }

  patchcurraddress(){
    this.f['isaddSame'].valueChanges
              .subscribe(res => {
                if(res){
                  this.f['permanentaddress'].patchValue(this.f['currentaddress'].value);
                  this.f['permanentaddress'].disable()
                }else{
                  this.f['permanentaddress'].reset();
                  this.f['permanentaddress'].enable();
                }
              })
  }

  onconfirmpass(){
    this.f['confirmpassword'].valueChanges
        .subscribe(res => {
          if(res !== this.f['password'].value){
            this.f['confirmpassword'].setErrors({
              invalidconfpass : 'password and confirm password must be same.'
            })
          }
        })
  }

  onaddskill(){
    if(this.skillarray.length < 5){
      let newcontrol = new FormControl(null, [Validators.required]);
      this.skillarray.push(newcontrol)
    }
  }

  onRemove(index : number){
    this.skillarray.removeAt(index)
  }

  onSignUp(){
    if(this.signupform.valid){
      console.log(this.signupform);
      console.log(this.signupform.value);
      this.signupform.reset()
      
    }
    console.log(this.signupform)
      console.log(this.signupform.value);
  }
}
