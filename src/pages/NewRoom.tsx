import { Link, useNavigate } from "react-router-dom"
import { FormEvent, useState } from "react"
//import { useAuth } from "../hooks/useAuth"


//import ammmm from "../assets/images/ammmm.svg" exemplo de import de imagem

import "../styles/auth.scss"
import { Button } from "../components/Button"
import { database } from "../services/firebase"
import { useAuth } from "../hooks/useAuth"


export function NewRoom() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [newRoom, setNewRoom] = useState("")


    async function handleCreateRoom(event: FormEvent){
        event.preventDefault() //não redireciona pra mesma página ao enviar o form

        if(newRoom.trim() === ""){ //prevenindo que o user não crie uma sala de nome cheio de espaços(.trim tira os espaços)
            return
        }

        const roomRef = database.ref("rooms") //estou dizendo para procurar todas as rooms dentro do bd
        
        const firebaseRoom = await roomRef.push({  //mandando um room novo pro bd(push)
            title: newRoom,
            authorId: user?.id
        })

        navigate(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div>

            <aside>
                <img alt="s"></img> //exemplo de import de imagem
                <strong>Cria salas de Q&amp;A ao-vivo</strong> //&amp; especifica que é o símbolo(&)
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>

            <main>
                <div className="main-content"></div> //usar className quando for react, class é reservado do js
                <div>
                    <img alt="Letmeask"></img>
                    <h2>Criar uma nova sala</h2>
                    <div className="separator">...ou entre em uma sala!</div>
                    <form onSubmit={handleCreateRoom}> //tem que ser no form porque assim o enter também serve como submit
                        <input 
                         type="text"
                         placeholder="Nome da sala"
                         onChange={event => setNewRoom(event.target.value)} 
                         value={newRoom} /> //para que caso a variável seja alterada, o input altere junto
                        <Button type="submit">Criar sala</Button>
                    </form>
                    <p>Sala existente? <Link to="/">Clique Aqui</Link></p>
                </div>
            </main>

        </div>
    )
}