export type connectionStateType =
  | "connected"
  | "disconnected"
  | "poorConnection";
export type deviceType = "bulb" | "outlet" | "temperatureSensor";

export interface SmartDevice {
  type: deviceType;
  id: string;
  name: string;
  connectionState: connectionStateType;
}

export interface SmartBulb {
  type: "bulb";
  id: string;
  name: string;
  connectionState: connectionStateType;
  isTurnedOn: boolean;
  brightness: number; // <0, 100>
  color: string; // in the CSS formats
}
export interface SmartOutlet {
  type: "outlet";
  id: string;
  name: string;
  connectionState: connectionStateType;
  isTurnedOn: boolean;
  powerConsumption: number; // in watts
}
export interface SmartTemperatureSensor {
  type: "temperatureSensor";
  id: string;
  name: string;
  connectionState: connectionStateType;
  temperature: number; // in Celsius
}

export type deviceUnion = SmartBulb | SmartOutlet | SmartTemperatureSensor;

export interface ServerToClientEvents {
  "device-change": (device: deviceUnion) => void;
  hello: () => void;
}
export interface ClientToServerEvents {
  "show-device": (deviceId: string) => void;
}
