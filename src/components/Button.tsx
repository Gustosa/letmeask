//import { useState } from "react"
import { ButtonHTMLAttributes } from "react" //todos os atributos de botão HTML para tipagem

import "../styles/button.scss"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutLined?: boolean
}//HTMLButtonElement = elemento global de botão

export function Button({isOutLined, ...props}: ButtonProps){ //...props é o resto dos atributos
    /*const [counter, setCounter] = useState(0) - separando o useState em dois: o número recebido e a função para altera-lo

    function increment(){
        setCounter(counter + 1) -setei um novo valor baseado no anterior(imutabilidade)
    }*/

    return <button className={`button ${isOutLined ? "outlined" : ""}`} {...props}> //...props distribuí as propriedades para esse botão

    </button>
}