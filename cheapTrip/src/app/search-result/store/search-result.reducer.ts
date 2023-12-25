import * as SearchResultActions from './search-result.actions';

export interface ISearchResultState {
  someVal: any;
}
const initialState: ISearchResultState = {

  someVal: 'some attribute'
};

export function searchResultReducer(
  state = initialState,
  action: SearchResultActions.SearchResultActions
): ISearchResultState {
  switch (action.type) {
    case SearchResultActions.SOME_ACTION:
      // do smth
      return {
        ...state,
      };

    default:
      return state;
  }
}
