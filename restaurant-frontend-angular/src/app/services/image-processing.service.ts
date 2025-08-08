import { Injectable } from '@angular/core';
import { Item } from '../models/Item';
import { FileHandle } from '../models/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  constructor(private sanitizer: DomSanitizer) { }

  /* This method takes an item object containing a base64 encoded image, converts it to a Blob object and creates a sanitized
   * URL for displaying the image */
  public createImage(item: Item): Item {
    const itemImagesToFileHandle: FileHandle[] = [];

    const imageBlob = this.dataURItoBlob(item.image, "image/jpeg");
    const imageFile = new File([imageBlob], item.name.replace(/\s/g, ''), { type: "image/jpeg" });

    const finalFileHandle: FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };
    itemImagesToFileHandle.push(finalFileHandle);

    item.itemImages = itemImagesToFileHandle;
    return item;
  }

  /* This method takes a base64 encoded string and the type of image and converts it to a Blob object. */
  public dataURItoBlob(picByte: any, imageType: any) {
    const byteString = window.atob(picByte);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], { type: imageType });
    return blob;
  }
}