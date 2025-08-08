import { Food } from "../models/Food";

export class GlobalConstants {

    /* Messages */
    public static genericError: string = "Something went wrong";
    public static unauthorized: string = "Access detected without authorization";
    public static invalidForm: string = "Please fill out the form's fields";
    public static orderSent: string = "Your order has been successfully placed";
    public static pdfError: string = "Failed to fetch PDF";

}

export enum OrderStatus {
    NEW = 'New',
    PAYED = 'Payed',
    SHIPPED = 'Shipped',
    CANCELED = 'Canceled',
    REFUNDED = 'Refunded',
}

export const sample_foods: Food[] = [
  {
    id: 1,
    name: 'Lobster ravioli',
    price: 26,
    description: 'Ravioli style pasta filled with lobster.',
    imageUrl: '/assets/images/lobster-ravioli.jpg'
  },
  {
    id: 2,
    name: 'Cotoletta alla milanese',
    price: 16,
    description: 'A veal chop pounded thin, coated in seasoned breadcrumbs and pan-fried to golden perfection.',
    imageUrl: '/assets/images/cotoletta-alla-milanese.jpg'
  },
  {
    id: 3,
    name: 'Tiramisù',
    price: 8,
    description: 'Ladyfingers (savoiardi) dipped in coffee, layered with a whipped mixture of eggs, sugar and mascarpone and flavoured with cocoa.',
    imageUrl: '/assets/images/tiramisù.jpg'
  },
  {
    id: 4,
    name: 'Lasagna',
    price: 13,
    description: 'Layers of pasta sheets filled with bolognese sauce, béchamel, and parmesan cheese. Ladyfingers (savoiardi) dipped in coffee, layered with a whipped mixture of eggs, sugar and mascarpone and flavoured with cocoa.',
    imageUrl: '/assets/images/lasagna.jpg'
  },
  {
    id: 5,
    name: 'Ossobuco',
    price: 23,
    description: 'A specialty of lombard cuisine of cross-cut veal shanks braised with vegetables, white wine, and broth.',
    imageUrl: '/assets/images/ossobuco.jpg'
  }
];