import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";


type FirebaseQuestions = Record<string, { //Record é utilizado(no ts) quando a chave primária é uma string, e o valor é um objeto
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

type QuestionType = {
    id: string
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

export function useRoom(roomId: string) {
    const { user } = useAuth()
    const [questions, setQuestions] = useState<QuestionType[]>([]) //a tipagem Question serve para informar o tipo das questions e do setQuestions
    const [title, setTitle] = useState("")

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on("value", room => { //on executa várias vezes, once somente uma. O "value" chama todos valores do roomRef, nesse caso, todos os roomIds
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.question

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => { //.entries transfoma as perguntas em forma de objeto para arrays em forma de chave primária e value
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length, //.values retorna os valores do objeto?; value.likes ou null, vazio, nada, ?
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0] //caso o .find retorne algo, o ?.[0] pega o primeiro like que o .find retornar
                    // hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id) .some retorna se achou o unão(true ou false), diferente do .find por exemplo, que retorna o objeto
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

        return () => {
            roomRef.off("value") //desliga/remove o event listener
        }
    }, [roomId, user?.id]) //toda vez que o roomId ou user.id mudar, o useEffect executa. Porque essas duas? 1.essas informações(no caso, só o roomId) podem mudar na tela do usuario enquanto ele estiver no mesmo caminho(ou mesma página?); 2.essas informações são de FORA do useEffect, são dependências do mesmo, e portanto precisam ser recarregadas para o useEffect funcione de forma apropriada

    return { questions, title }
}