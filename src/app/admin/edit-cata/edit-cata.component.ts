import { Tequila } from './../../models/tequila.model';
import { CanComponentDeactivate } from './../../services/can-deactivate-guard.service';
import { CataUser } from './../../models/cata_user.model';
import { HttpService } from './../../services/http.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { default as swal } from 'sweetalert2'
import { SortNamePipe } from "../../shared/order-name.pipe";
@Component({
  selector: 'cata-edit-cata',
  templateUrl: './edit-cata.component.html',
  styleUrls: ['./edit-cata.component.css']
})
export class EditCataComponent implements OnInit, CanComponentDeactivate {

  id : string = "";
  hasSaved : boolean = false;
  cataOriginal : CataUser = new CataUser(null,null,null,null,null);
  cata : CataUser = new CataUser(null,null,null,null,null);

  tequilaCatalogue : Tequila[] = []; //todo... change to model

  user = JSON.parse(this.cookies.get('user'));

  activeTab : string = "Tequila";

  selectedTequila : Tequila = null;

  participantTequilas : Tequila[] = [];

  constructor(private route : ActivatedRoute, private router : Router,
              private cookies : CookieService, private httpService : HttpService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.httpService.getCata(this.id,this.user.id).subscribe((cata)=>{
      this.cataOriginal = Object.assign({}, cata);
      this.cata = cata;
      this.participantTequilas = this.cata.tequilas;
      this.httpService.getTequilas(this.cata.kind, this.user.id).subscribe((data)=>{
          this.tequilaCatalogue = data;
          let pipe = new SortNamePipe();
          if(this.tequilaCatalogue.length > 0){
              let orderedTequilas = pipe.transform(this.tequilaCatalogue);
              this.selectedTequila = orderedTequilas[0];
          }
      });
    });
    
  }

  goBack(){
    this.router.navigateByUrl('/admin');
  }

  edit(values:any){
    if(this.noChangesDetected(this.cataOriginal,values)) return;
    this.httpService.updateCataInfo(this.id, values, this.user.id).subscribe((response)=>{
      swal({
        title : 'Cambios guardados',
        text : 'La cata ha sido actualizada',
        timer : 1000,
        showConfirmButton : false
      }).then((success)=>{}, (err)=>{})
      this.hasSaved = true;
    });
  }

  canDeactivate() : Observable<boolean> | Promise<boolean> | boolean{
    if(!this.noChangesDetected(this.cataOriginal, this.cata) && !this.hasSaved) {
      return swal({
          title: '¿Desea salir?',
          text: "Sus cambios no se han guardado...",
          showCancelButton : true,
          confirmButtonText: 'Sí, salir',
          cancelButtonText : 'Cancelar'
        }).then(()=> {
          return true;
        }, ()=>{
          console.log('cerrado');
        });
    }

    return true;
  }

  noChangesDetected(original, current):boolean{
    return original.kind === current.kind && original.name === current.name && original.place === current.place
  }

  addTequilasToCata(userId: string){
    let ids = [];
    this.participantTequilas.forEach((tequila)=>{ids.push(tequila._id)});
    //api call...
    this.httpService.addTequilasToCata(this.id, ids, userId).subscribe((response)=>{
       swal('Listo', 'Operación realizada con éxito')
    });
  }

  addSelection(id:string){

    if(this.participantTequilas.length == 10) {
      swal('Error', 'Ya no es posible agregar tequilitas');
      return;
    }

    let found = false;
    this.participantTequilas.forEach((teq)=>{
      if(teq._id ===  this.tequilaCatalogue[id]._id){
        found = true;
        swal('Atención', 'El tequila ' + this.tequilaCatalogue[id].name + ' ya ha sido agregado');
        return;
      }
    });

    if(!found) this.participantTequilas.push(this.tequilaCatalogue[id]);

  }

  onChange(id:number){
    this.selectedTequila = this.tequilaCatalogue[id];
  }

  removeFromList(id:number){
    this.participantTequilas.splice(id,1);
    this.selectedTequila = undefined;
  }

}
