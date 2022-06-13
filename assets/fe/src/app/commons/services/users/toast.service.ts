import { Injectable, TemplateRef } from '@angular/core';

export interface ToastOptions {

  /**
   * @default "top-right"
   */
  position?: "top-right" | "bottom-center",
  classname?: string  
  delay?: number
  [key: string]: any
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: any, options: ToastOptions = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  unexpected(textOrTpl: string | TemplateRef<any> = "Unexpected error occured", options: ToastOptions = {}){
    this.toasts.push({textOrTpl ,...options})
  }
}