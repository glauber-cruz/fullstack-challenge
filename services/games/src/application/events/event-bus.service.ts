import { Injectable } from "@nestjs/common";

type Listener = (data: any) => void;

@Injectable()
export class EventBusService {
  private listeners = new Map<string, Listener[]>();

  emit(event: string, data?: any) {
    const list = this.listeners.get(event) || [];
    list.forEach((fn) => fn(data));
  }

  on(event: string, fn: Listener) {
    const list = this.listeners.get(event) || [];
    list.push(fn);
    this.listeners.set(event, list);
  }
}
