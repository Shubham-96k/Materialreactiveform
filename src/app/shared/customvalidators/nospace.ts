import { AbstractControl, Validators } from "@angular/forms";





export class Nospacevalidator{


    static nospacecontrol(controls : AbstractControl) : Validators | null{
        if(!controls.value){
            return null
        }
        if(controls.value.includes(' ')){
            return {
                nospacerror : 'space is not allowed!'
            }
        }else{
            return null
        }
    }
}