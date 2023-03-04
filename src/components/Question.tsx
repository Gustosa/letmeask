import { ReactNode } from "react";
import classNames from "classnames"

import "../styles/question.scss"

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    children?: ReactNode //ReactNode é uma tipagem para conteúdo jsx em geral(pode ser div, svg, componente, div e componente, qualquer coisa)
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

export function Question({ content, author, children, isAnswered = false, isHighlighted = false }: QuestionProps) {
    return (
        <div className={classNames( //mais simples fazer com o classname do que com um monte de "? :"(o nome disso é if ternário?)
            "question",
            { answered: isAnswered },
            { highlighted: isHighlighted && !isAnswered}
        )}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </div>
    )
}