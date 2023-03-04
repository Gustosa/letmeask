import { createContext, ReactNode, useState, useEffect } from "react"
import { firebase, auth } from "../services/firebase";

type User = {
    id: string,
    name: string,
    avatar: string
}

type AuthContextType = {
    user: User | undefined,
    signInWithGoogle: () => Promise<void> //async/await sempre retornam uma promise
}

type AuthContextProviderProps = {
    children: ReactNode //componente react como children = ReactNode
}

export const AuthContext = createContext({} as AuthContextType) //passo só o formato, nesse caso, {} é o formato de object([] seria array, "" string, etc)

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>() //undefined porque user começa como undefined

    useEffect(() => {  
        const unsubscribe = auth.onAuthStateChanged(user => { //dispara um evento sempre que alguma informação mudar, nesse caso, o estado do usuário. Se detectar um login de um user, a função vai retornar o user
            if (user) {
                const { uid, displayName, photoURL } = user

                if (!displayName || !photoURL) {
                    throw new Error("Missing info")
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }
        })

        return () => {
            unsubscribe() //desligando o event listener(onAuthStateChanged), assim ele não fica executando(e dando erro) quando o usuário sair da tela
        }

    }, []) //função, quando executar essa função(sempre um array)

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider)

        if (result.user) {
            const { uid, displayName, photoURL } = result.user

            if (!displayName || !photoURL) {
                throw new Error("Missing info")
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}> //tudo que estiver dentro desse componente vai ter acesso às informações dele
            {props.children}
        </AuthContext.Provider>
    )
}