import React, { useReducer, useState } from 'react'

export default (reducer, actions, defaultValue) => {
    const Context = React.createContext()

    const Provider = ({ children }) => {
        const [state, dispatch] = useReducer(reducer, defaultValue)
        const [userContext, setUserContext] = useState(5555555)

        const boundActions = {}
        for (let key in actions) {
            boundActions[key] = actions[key](dispatch)
        }

        return (
            <Context.Provider value={{ state, ...boundActions, userContext, setUserContext }}>
                {children}
            </Context.Provider>
        )
    }
    return { Context, Provider }
}