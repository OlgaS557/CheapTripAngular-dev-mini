import { Action } from '@ngrx/store/src';


export const SOME_ACTION = '[Search Result] Some Action';


export class SomeAction implements Action {
  readonly type = SOME_ACTION;
  constructor(public payload: any) {}
}

export type SearchResultActions =
  SomeAction
  ;
