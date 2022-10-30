import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext(null);

function reducer(state, action) {
    switch (action.type) {
        case 'currentState': {
            return state;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
};

export function AuthProvider({ children }) {
    return (
        <AuthContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}