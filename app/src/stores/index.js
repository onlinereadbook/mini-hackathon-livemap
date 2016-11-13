import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import markers from '../reducers/markerReducer';
import rooms from '../reducers/roomReducer';
import messages from '../reducers/messageReducer';


const Reducers = combineReducers({
    markers,
    rooms,
    messages
});

export default applyMiddleware(thunk)(createStore)(Reducers, window.devToolsExtension ? window.devToolsExtension() : undefined);
