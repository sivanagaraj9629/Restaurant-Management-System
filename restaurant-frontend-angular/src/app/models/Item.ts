import { FileHandle } from "./file-handle.model";

export class Item {
	id!: number;
	name!: string;
	description!: string;
	price!: number;
	status!: string;
	categoryId!: number;
	categoryName!: string;
	image!: Uint8Array;
	itemImages!: FileHandle[];
}
