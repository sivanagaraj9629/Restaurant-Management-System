import { SafeUrl } from "@angular/platform-browser";
import { Item } from "./Item";
import { FileHandle } from "./file-handle.model";
import { ImageProcessingService } from "../services/image-processing.service";

export class CartProduct {

    constructor(public item: Item) {}

    quantity: number = 1;
    price: number = this.item.price;
    imageByte: Uint8Array = this.item.image;
    image!: FileHandle;
}