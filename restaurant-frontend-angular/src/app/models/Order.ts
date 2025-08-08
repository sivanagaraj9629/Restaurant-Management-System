import { OrderStatus } from "../shared/global-constants";
import { CartProduct } from "./CartProduct";

export class Order {
    id!: number;
    products!: CartProduct[];
    totalPrice!: number;

    name!: string;
    email!: string;
    address!: string;
    contactNumber!: string;

    createdAt!: Date;
    status!: OrderStatus;
}