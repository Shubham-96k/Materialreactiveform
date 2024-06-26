import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";




export class emailValidator{


    static isEmailValid(controls : AbstractControl) : Promise<ValidationErrors | null> | Observable<ValidationErrors | null>{

        let val : string = controls.value as string;

        return new Promise<ValidationErrors|null>((res,rej)=>{
            setTimeout(()=>{
                if(val === 'jhon@gmail.com'){
                    res({
                        emailexist : 'Email already exist.'
                    })
                }else{
                    res(null)
                }
            },2000)
        })
    }
}