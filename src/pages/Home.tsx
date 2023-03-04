import { useNavigate } from "react-router-dom"

import { useAuth } from "../hooks/useAuth"

import ammmm from "../assets/images/ammmm.svg" //exemplo de import de imagem

import "../styles/global.scss"
import { Button } from "../components/Button"
import { FormEvent, useState } from "react"
import { database } from "../services/firebase"

export function Home() {
    const navigate = useNavigate() //precisa estar dentro do componente por que o useNavigate utiliza informações do contexto do componente
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState("")


    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle() //restante do código só executa quando o await terminar
        }

        navigate("/rooms/new")
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if (roomCode.trim() === "") { //prevenindo que o user não crie uma sala de nome cheio de espaços(.trim tira os espaços)
            return
        }

        const roomRef = database.ref(`rooms/${roomCode}`).get() //estou dizendo para procurar a room específica do código informado pelo user dentro do bd; .get() traz todos os dados da room?

        if (!(await roomRef).exists()) {
            alert("Room does not exist.")
            return
        }

        if ((await roomRef).val().endedAt) {
            alert("Room already closed.")
            return
        }

        navigate(`/rooms/${roomCode}`)

    }

    return (
        <div id="page-auth">

            <aside>
                <img alt="s"></img> //exemplo de import de imagem
                <strong>Cria salas de Q&amp;A ao-vivo</strong> //&amp; especifica que é o símbolo(&)
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>

            <main>
                <div className="main-content"></div> //usar className quando for react, class é reservado do js
                <div>
                    <img alt="Letmeask"></img>
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img alt="Logo Google"></img>
                        Cria sua sala com o Google
                    </button>
                    <div className="separator">...ou entre em uma sala!</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode} />
                    </form>
                    <Button type="submit">
                        Entrar na sala
                    </Button>
                </div>
            </main>

        </div>
    )
}