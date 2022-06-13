import { animate, style, transition, trigger } from "@angular/animations";

export const slideFromTop = trigger('slideFromTop', [
    transition(':enter', [
        style({ transform: 'translateY(-100%)'}),
        animate('0.4s ease', style({ transform: 'translateY(0%)'}))
    ]) ,
    transition(':leave', [
        style({ transform: 'translateY(0%)'}),
        animate('0.4s ease-out', style({ transform: 'translate(-100%)'}))
    ])
])


export const slideFromRight = trigger('slideFromRight', [
    transition(':enter', [
        style({ transform: 'translateX(100%)'}),
        animate('0.4s ease', style({ transform: 'translateX(0%)'}))
    ]) ,
    transition(':leave', [
        style({ transform: 'translateX(0%)'}),
        animate('0.4s ease-out', style({ transform: 'translateX(100%)'}))
    ])
])
export const fadeAnimation = trigger('fadeInOut', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease', style({ opacity: 1 }))
    ]) ,
    transition(':leave', [
        animate('0.2s ease-out', style({ opacity: 0 }))
    ])
])