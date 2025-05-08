export interface IVehicleStatus {
    vehicleId: string;
    timestamp: Date;
    rawData: {
        status: number;
    };
}