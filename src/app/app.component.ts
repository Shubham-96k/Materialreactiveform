import { Component, OnInit } from '@angular/core';
import { CustomRegex } from './shared/const/validationpatt';
import { Nospacevalidator } from './shared/customvalidators/nospace';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from './shared/customvalidators/validemail';
import { EmpIdValidator } from './shared/customvalidators/empidvalidator';
import { Icountry } from './shared/model/countryinterface';
import { COUNTRIES_META_DATA } from './shared/const/country';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'myproject';
  hide = true;
  signupform !: FormGroup;
  countries : Array<Icountry> = COUNTRIES_META_DATA;

  ngOnInit(): void {
    this.onCreateform(),
    this.enableconfirmpass(),
    this.onConfirmpassword(),
    this.curraddvalid(),
    this.patchcurraddress()
  }

  onCreateform(){
    this.signupform = new FormGroup({

      userinfo : new FormGroup({
        username : new FormControl(null, [Validators.required,
          Validators.pattern(CustomRegex.username),
          Validators.minLength(5),
          Validators.maxLength(9),
          Nospacevalidator.nospace
          ]),
        email : new FormControl(null, [Validators.required,Validators.pattern(CustomRegex.email)],[EmailValidator.isemailValid])
      }),
      password : new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.password)]),
      confirmpassword : new FormControl({value : null, disabled : true}, [Validators.required, Validators.pattern(CustomRegex.password)]),
      skills : new FormArray([new FormControl(null, Validators.required)]),
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
      isaddSame : new FormControl({value : null, disabled : true})
    })
  }

  // accessing single formcontrol
  get username(){
    return this.signupform.get('username') as FormControl;
  }

  //accessing all controls
  get f(){
    return this.signupform.controls
  }

  //accessing skillsarray
  get skillarray(){
    return this.signupform.get('skills') as FormArray;
  }

  //on adding skill
  onaddskill(){
    if(this.skillarray.length < 5){
      let newcontrol = new FormControl(null, Validators.required);
      this.skillarray.push(newcontrol);
    }
  }

  //removing skill control
  onRemove(index : number){
    this.skillarray.removeAt(index)
  }

  //enable confirm password
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

  //confirm password
  onConfirmpassword(){
    this.f['confirmpassword'].valueChanges
        .subscribe(res => {
          if(res !== this.f['password'].value){
            this.f['confirmpassword'].setErrors({
              invalidconfpass : 'password and confirm password must be same.'
            })
          }
        })
  }

  //current address validation
  curraddvalid(){
    this.f['currentaddress'].valueChanges.subscribe(res => {
      if(this.f['currentaddress'].valid){
        this.f['isaddSame'].enable();
      }else{
        this.f['isaddSame'].disable();
      }
    })
  }


  //patching current address value to permanent address if add is same
  patchcurraddress(){
    this.f['isaddSame'].valueChanges
          .subscribe(res => {
            if(res){
              this.f['permanentaddress'].patchValue(this.f['currentaddress'].value);
              this.f['permanentaddress'].disable()
            }else{
              this.f['permanentaddress'].reset()
              this.f['permanentaddress'].enable()
            }
          })
  }







  //submission of form
  onSignUp(){
    if(this.signupform.valid){
      console.log(this.signupform.value);
      this.signupform.reset();
    }
  }
}
