import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

  CRITERIO_EXTRA = [
    {
      name : "Vista",
      type : 0,
      description : "El color generalmente debe ser dorado intenso a ámbar.",
      min : 3,
      max : 7,
      subs : [{name:"Color", rating:3},
              {name: "Limpidez/Brillo", rating : 3},
              {name: "Adherencia", rating:3}]
    },
    {
      name : "Olfato",
      type : 1,
      description: "En la intensidad se mide la fuerza del alcohol y la armonía aromática",
      min : 4,
      max: 7,
      subs : [{name:"Intensidad", rating:4},
              {name:"Fruta Seca",rating:4},
              {name:"Especia", rating:4},
              {name:"Madera", rating:4},
              {name:"Vainilla",rating:4},
              {name:"Cacao",rating:4},
              {name:"Balance",rating:4}]
    },
    {
      name : "Gusto",
      type : 2,
      description : "Se destaca un sutil dulzor propiciado por la madera de la barrica",
      min : 1,
      max : 3,
      subs : [{name:"Dulce",rating:1},{name:"Amargo",rating:1}, 
              {name:"Maderización",rating:1},{name:"Alcohol",rating:1}, 
              {name:"Balance",rating:1}]
    },
    {
      name : "Tacto",
      type : 3,
      description : "El fin de boca se conoce como una persistencia media y prolongada",
      min : 3,
      max : 5,
      subs: [{name:"Astringencia",rating:3}, {name:"Persistencia",rating:3}, 
             {name:"Fin de Boca",rating:3}]

    }
  ]

  CRITERIO_REPOSADO = [
    {
      name : "Vista",
      type : 0,
      description : "El color generalmente debe ser dorado intenso a ámbar.",
      min : 3,
      max : 7,
      subs : [{name:"Color", rating:3},
              {name: "Limpidez/Brillo", rating : 3},
              {name: "Adherencia", rating:3}]
    },
    {
      name : "Olfato",
      type : 1,
      description: "En la intensidad se mide la fuerza del alcohol y la armonía aromática",
      min : 4,
      max: 7,
      subs : [{name:"Intensidad", rating:4},
              {name:"Agave",rating:4},
              {name:"Fruta", rating:4},
              {name:"Flor", rating:4},
              {name:"Herbal",rating:4},
              {name:"Madera",rating:4},
              {name:"Balance",rating:4}]
    },
    {
      name : "Gusto",
      type : 2,
      description : "Se destaca un sutil dulzor propiciado por la madera de la barrica",
      min : 1,
      max : 3,
      subs : [{name:"Dulce",rating:1},
              {name:"Amargo",rating:1}, 
              {name:"Maderización",rating:1},
              {name:"Alcohol",rating:1}, 
              {name:"Balance",rating:1}
             ]
    },
    {
      name : "Tacto",
      type : 3,
      description : "El fin de boca se conoce como una persistencia media y prolongada",
      min : 3,
      max : 5,
      subs: [{name:"Astringencia",rating:3}, {name:"Persistencia",rating:3}, 
             {name:"Fin de Boca",rating:3}]

    }
  ]

  CRITERIO_BLANCO = [
    {
      name : "Vista",
      type : 0,
      description : "El color generalmente debe ser dorado intenso a ámbar.",
      min : 3,
      max : 7,
      subs : [{name: "Matiz", rating:3},
              {name: "Limpidez/Brillo", rating : 3},
              {name: "Adherencia", rating:3}]
    },
    {
      name : "Olfato",
      type : 1,
      description: "En la intensidad se mide la fuerza del alcohol y la armonía aromática",
      min : 4,
      max: 7,
      subs : [{name:"Intensidad", rating:4},
              {name:"Agave",rating:4},
              {name:"Fruta", rating:4},
              {name:"Flor", rating:4},
              {name:"Herbal",rating:4},
              {name:"Cítrico",rating:4},
              {name:"Balance",rating:4}]
    },
    {
      name : "Gusto",
      type : 2,
      description : "Se destaca un sutil dulzor propiciado por la madera de la barrica",
      min : 1,
      max : 3,
      subs : [{name:"Dulce",rating:1},
              {name:"Amargo",rating:1}, 
              {name:"Acidez",rating:1},
              {name:"Alcohol",rating:1}, 
              {name:"Balance",rating:1}
             ]
    },
    {
      name : "Tacto",
      type : 3,
      description : "El fin de boca se conoce como una persistencia media y prolongada",
      min : 3,
      max : 5,
      subs: [{name:"Astringencia",rating:3}, {name:"Persistencia",rating:3}, 
             {name:"Fin de Boca",rating:3}]

    }
  ]

  constructor() { }

  getCriteria(type:number){
    if(type === 0) return this.CRITERIO_BLANCO;
    else if(type === 1) return this.CRITERIO_REPOSADO;
    else return this.CRITERIO_EXTRA;
  }

}
