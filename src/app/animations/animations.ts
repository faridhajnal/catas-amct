import {
    trigger,
    state,
    style,
    animate,
    group,
    transition,
    keyframes
  } from '@angular/core';

  
  export const fadeIn = trigger('fadeIn', [
    transition(':enter', [
      animate('600ms ease-in', keyframes([
        style({opacity: 0, transform: 'translateY(-70px)', offset: 0}),
        style({ opacity: 1, transform: 'translateY(25px)', offset: .75}),
        style({ opacity: 1, transform: 'translateY(0)', offset: 1})
      ]))
    ])
  ]);

  export const fadeUp = trigger('fadeUp', [
    transition(':enter', [
      animate('700ms ease-in', keyframes([
        style({opacity: 0, transform: 'translateY(70px)', offset: 0}),
        style({ opacity: 1, transform: 'translateY(0)', offset: 1}),
      ]))
    ])
  ]);

 export const fadeOut =  trigger('fadeOut', [
	transition(':leave', [
		animate('600ms ease-in', keyframes([
			style({opacity: 1, transform: 'translateX(0)', offset: 0 }),
			style({opacity: 0, transform: 'translateX(50px)', offset: 1})
			]))
	]),
	transition(':enter', [
		animate('600ms ease-in', keyframes([
			style({opacity: 0, transform: 'translateX(50px)', offset: 0 }),
			style({opacity: 1, transform: 'translateX(0)', offset: 1})
			]))
	])
]);

export const slideOut = trigger('slideOut', [
  transition(':enter', [  
    style({transform: 'translateY(-100%)', opacity: 0, position: 'relative'}),
    animate('500ms ease-in-out', style({transform: 'translateY(0%)', opacity: 1}))
  ]),
  transition(':leave', [ 
    style({transform: 'translateY(0%)', opacity: 1, position: 'relative'}),
    animate('400ms ease-in-out', style({transform: 'translateY(100%)', opacity: 0}))
  ])
]);
