import { ActionReducerMap } from '@ngrx/store';
import * as fromTripDirection from '../trip-direction/store/trip-direction.reducer';
import * as fromSearchResult from '../search-result/store/search-result.reducer';

export interface AppState {
  directions: fromTripDirection.ITripDirectionState;
  searchResult: fromSearchResult.ISearchResultState;
}

export const appReducer: ActionReducerMap<AppState> = {
  directions: fromTripDirection.tripDirectionReducer,
  searchResult: fromSearchResult.searchResultReducer
};
