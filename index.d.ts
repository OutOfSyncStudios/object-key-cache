declare module 'object-key-cache';

declare class ObjectKeyClass {
  attachToClient(client: any): void;
  detachFromClient(): void;
  connect(): Promise<any>;
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<any>;
  del(key: string): Promise<any>;
  hget(hash: string, key: string): Promise<any>;
  hset(hash: string, key: string, value: any): Promise<any>;
  hdel(hash: string, key: string): Promise<any>;
  getAsync(key: string): Promise<any>;
  setAsync(key: string, value: any): Promise<any>;
  delAsync(key: string): Promise<any>;
  hgetAsync(hash: string, key: string): Promise<any>;
  hsetAsync(hash: string, key: string, value: any): Promise<any>;
  hdelAsync(hash: string, key: string): Promise<any>;
  calcObjKey(objKey: object): string
  oget(objKey: object): Promise<any>;
  oset(objKey: object, value: any): Promise<any>;
  odel(objKey: object): Promise<any>;
  ohget(hash: string, objKey: object): Promise<any>;
  ohset(hash: string, objKey: object, value: any): Promise<any>;
  ohdel(hash: string, objKey: object): Promise<any>;
  ogetAsync(key: object): Promise<any>;
  osetAsync(key: object, value: any): Promise<any>;
  odelAsync(key: object): Promise<any>;
  ohgetAsync(hash: string, key: object): Promise<any>;
  ohsetAsync(hash: string, key: object, value: any): Promise<any>;
  ohdelAsync(hash: string, key: object): Promise<any>;
  clear(): Promise<any>;
  close(): Promise<any>;
}

declare let obj: ObjectKeyClass;
export default obj;