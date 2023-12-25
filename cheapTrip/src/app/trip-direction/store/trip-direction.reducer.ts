import { IPath, IPathPoint, Modes, Server } from '../trip-direction.model';
import * as TripDirectionActions from './trip-direction.actions';

export interface ITripDirectionState {
  startPoint: IPathPoint;
  endPoint: IPathPoint;
  startPointAutoComplete: Array<IPathPoint>;
  endPointAutoComplete: Array<IPathPoint>;
  paths: IPath[];
  mode: Modes;
  errorMessage: string;
  pathsAmount: number;
  isLoading: boolean;
  reset: boolean;
  currentServer: Server;
  serverChanged: boolean;
}

const initialState: ITripDirectionState = {
  startPoint: { id: 0, name: '' },
  endPoint: { id: 0, name: '' },
  startPointAutoComplete: [],
  endPointAutoComplete: [],
  paths: [],
  mode: Modes.SEARCH,
  errorMessage: '',
  pathsAmount: 0,
  isLoading: false,
  reset: false,
  currentServer: 'server104',
 serverChanged: false
};

export function tripDirectionReducer(
  state = initialState,
  action: TripDirectionActions.TripDirectionActions
): ITripDirectionState {
  switch (action.type) {
    case TripDirectionActions.SET_START_POINT:
      return {
        ...state,
        startPoint: action.payload,
      };

    case TripDirectionActions.SET_END_POINT:
      return {
        ...state,
        endPoint: action.payload,
      };

    case TripDirectionActions.SET_START_POINT_AUTOCOMPLETE:
      let newStartAutocompleteList = [];
      if (action.payload.length === 0) {
        newStartAutocompleteList = [...state.startPointAutoComplete];
      } else {
        newStartAutocompleteList = action.payload;
      }
      return {
        ...state,
        startPointAutoComplete: newStartAutocompleteList,
      };

    case TripDirectionActions.SET_END_POINT_AUTOCOMPLETE:
      let newEndAutocompleteList = [];
      if (action.payload.length === 0) {
        newEndAutocompleteList = [...state.endPointAutoComplete];
      } else {
        newEndAutocompleteList = action.payload;
      }
      return {
        ...state,
        endPointAutoComplete: newEndAutocompleteList,
      };

    case TripDirectionActions.GET_START_POINT:
      return {
        ...state,
      };

    case TripDirectionActions.GET_END_POINT:
      return {
        ...state,
      };

    case TripDirectionActions.GET_AUTOCOMPLETE:
      if (state.reset) {
        return {
          ...state,
          reset: false,
        };
      }
      return {
        ...state,
      };
    case TripDirectionActions.GET_ROUTS:
      return {
        ...state,
        isLoading: true,
      };

    case TripDirectionActions.SET_ROUTS:
      const pathsAmount = action.payload.paths.length;
      const length1 = action.payload.paths.reduce((sum, current) => {
        return sum + current.details.direct_paths.length;
      }, 0);

      const res = length1 + pathsAmount;
      return {
        ...state,
        paths: [...action.payload.paths],
        startPoint: action.payload.endPoints.from,
        endPoint: action.payload.endPoints.to,
        mode: Modes.DELIVERY,
        pathsAmount: res,
        isLoading: false,
      };

    case TripDirectionActions.AUTOCOMPLETE_FAIL:
      let server = 'server68';
      if (state.currentServer == 'server104' ){
      //  server = Server.SERVER104;
      }
      return {
        ...state,
     //   currentServer: server,
     //   serverChanged: true
      };

    case TripDirectionActions.CLEAN_DATA:
      const empty = { id: 0, name: '' };
      return {
        ...state,
        startPoint: empty,
        endPoint: empty,
        startPointAutoComplete: [],
        endPointAutoComplete: [],
        errorMessage: '',
        //  toHome: action.payload,
      };

    case TripDirectionActions.SET_MODE:
      return {
        ...state,

        mode: action.payload,
      };

    case TripDirectionActions.GO_HOME:
      return {
        ...state,
        startPoint: { id: 0, name: '' },
        endPoint: { id: 0, name: '' },
        startPointAutoComplete: [],
        endPointAutoComplete: [],
        paths: [],
        mode: Modes.SEARCH,
        errorMessage: '',
        pathsAmount: 0,
        isLoading: false,
        reset: true,
      };

    default:
      return state;
  }
}
