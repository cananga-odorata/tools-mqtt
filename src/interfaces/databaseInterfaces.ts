export interface IVehicleStatus {
    vehicleId: string;
    timestamp: Date;
    rawData: {
        model: number;
        status: number;
    };
}

export interface IVehicleHeartbeat {
    vehicleId: string;
    timestamp: Date;
    rawData: {
        mode: number;
        temp: number;
        voltage: number;
        total_usage_time: number;
        sesstion_usage: number;
    };
}