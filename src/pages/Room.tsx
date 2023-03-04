import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import "../styles/room.scss"


type RoomParams = {
    id: string
}

export function Room() {
    const { user } = useAuth()
    const params = useParams<RoomParams>()
    const [newQuestion, setNewQuestion] = useState("")
    const roomId = params.id!
    const { title, questions } = useRoom(roomId)

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault()

        if (newQuestion.trim() === "") { //prevenindo que o user não crie uma sala de nome cheio de espaços(.trim tira os espaços)
            return
        }

        if (!user) {
            throw new Error("Você precisa se cadastrar primeiro")
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)

        setNewQuestion("")
    }

    async function handleLikeQuestion(questionId: string, likeId:string | undefined) {
        if (likeId) {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
        } else {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id
            })
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src="" />
                    <RoomCode code={roomId} /> //se eu defini o id do params como string, por que ele ainda está como string | undefined????
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>} //if, then(&&)
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="Digite sua pergunta"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name} </span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

                <div className="question-list">
                    {questions.map(question => { //.map() percorre todas as questions permite que eu retorne as mesmas(diferente de um for each)
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <button
                                    className={`like-button ${question.likeId ? "liked" : ""}`}
                                    type="button"
                                    aria-label="Marcar como gostei"
                                    onClick={() => handleLikeQuestion(question.id, question.likeId)} //passar handleLikeQuestion(question.id) não funciona porque assim eu estou passandoa EXECUÇÃO de um finção, e não uma função em si
                                >
                                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                    //aqui deveria ter o svg do like, porque para poder alterar a cor de um svg(no react), é preciso inseri-lo diretamente
                                </button>
                                )}
                            </Question>
                        )
                    })}
                </div>

            </main>
        </div>
    )
}