import { Request } from 'express';

export default class Context {
  // tslint:disable-next-line: variable-name member-access
  static _bindings = new WeakMap<Request, Context>();
  
  // tslint:disable-next-line: member-access
  static bind (req: Request) : void {
    const ctx = new Context();
    Context._bindings.set(req, ctx);
  }
    
  // tslint:disable-next-line: member-access
  static get (req: Request) : Context | null {
    return Context._bindings.get(req) || null;
  }
  
  public username = '';

  constructor () {}
}
