export interface carRequest {
    id: string;
    callCenterId: string;
    customerName: string;
    customerPhone: string;
    pickingAddress: string;
    latPickingAddress?: number;
    lngPickingAddress?: number;
}