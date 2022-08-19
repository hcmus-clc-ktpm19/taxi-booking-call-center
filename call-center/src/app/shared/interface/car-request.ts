export interface carRequest {
    id: string;
    callCenterId: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    driverId: string;
    driverName: string;
    driverPhone: string;
    pickingAddress: string;
    carType: string;
    status: string;
    price: number;
    distance: number;
    latPickingAddress: number;
    lngPickingAddress: number;
    arrivingAddress: string;
    lngArrivingAddress: number;
    latArrivingAddress: number;
}