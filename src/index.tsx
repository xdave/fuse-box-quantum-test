import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, Store, Middleware, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { connect, Provider } from 'react-redux';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

// A place to store the redux store for hot-reloading
declare global {
    interface Window {
        __REDUX_STORE__: Store<State>;
    }
}

// Action creator factory for key `app`
const createAppAction = actionCreatorFactory('app');

const setMessage = createAppAction<string>('SET_MESSAGE');

interface State {
    message: string;
}

const initialState: State = {
    message: '<initial>'
};

const reducer = reducerWithInitialState(initialState)
    .case(setMessage, (state, message) => ({
        ...state,
        message: message ? message : '<empty>'
    }))
    .build();

const middleware = () => {
    const devMiddleware = (process.env.NODE_ENV !== 'production')
        ? [createLogger({ level: 'info', collapsed: true })] : [];

    return [
        ...devMiddleware
    ];
};

// Uses existing store if we're hot-reloading
const store = window.__REDUX_STORE__
    ? (window.__REDUX_STORE__.replaceReducer(reducer), window.__REDUX_STORE__)
    : window.__REDUX_STORE__ = createStore(reducer, applyMiddleware(...middleware()));

const mapStateToProps = (state: State) => state;
const mapDispatchToProps = { setMessage };
const mergeProps = (state: State, actions: typeof mapDispatchToProps) => ({
    ...state,
    submit: (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const message = e.currentTarget.message.value.trim();
        actions.setMessage(message);
        return false;
    }
});

const connector = connect(mapStateToProps, mapDispatchToProps, mergeProps);

const Main = connector(({ message, submit }) => (
    <div>
        <span>{message}</span>
        <form onSubmit={submit}>
            <input name="message" type="text" />
            <button type="submit">Set Message</button>
        </form>
    </div>
));

class AppContainer extends React.Component<{}, {}> {
    render() {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        )
    }
}

ReactDOM.render((
    <AppContainer>
        <Main />
    </AppContainer>
), document.querySelector('#app'));
