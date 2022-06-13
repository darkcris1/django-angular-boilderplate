import {
    Directive,
    Output,
    EventEmitter,
    HostBinding,
    HostListener,
    Input
} from '@angular/core';
import { getExt } from '../utils/helper.util';

@Directive({
    selector: '[dropFile]'
})
export class DropFileDirective {

    @Input() dropFile: string | null = null;
    @Output() onFileDropped = new EventEmitter<any>();

    @HostBinding('style.opacity') private opacity = "1";

    @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.opacity = "0.8";
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.opacity = '1';
    }

    @HostListener('drop', ['$event']) ondrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.opacity = '1';

        let target = event.dataTransfer as DataTransfer;
        if(target.files.length > 0 && this.isAcceptable(target.files)) {
        this.onFileDropped.emit(target.files[0]);
        }
    }


    isAcceptable(files: FileList) {
        if (!this.dropFile) return true;
        const acceptableExts = this.dropFile.split(",").map(o=>o.trim())
        
        for (let file of Array.from(files)) {
        const ext =  getExt(file.name)
        if (acceptableExts.includes(ext)) return true;
        }

        return false;
    }
}