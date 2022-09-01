import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";


function Card( {card, onCardClick, onCardLike, onCardDelete }) {
    const currentUser = React.useContext(CurrentUserContext);

    const isOwn = card.owner._id === currentUser._id;
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    const cardDeleteButtonClassName = (
        `element__delete-button hover ${isOwn ? 'element__delete-button_visible' : 'element__delete-button_hidden'}`

    );
    const cardLikeButtonClassName = (
        `element__like-button ${isLiked ? 'element__like-button_active' : ''}`
      );

    function handleCardClick() {
        onCardClick(card)
    };
    function handleCardLike() {
        onCardLike(card)
    };
    function handleCardDelete() {
        onCardDelete(card)
    }

    return (
        <li className="element">
            <button className={cardDeleteButtonClassName} type="button" aria-label="Удалить" onClick={handleCardDelete}/>
            <img src={card.link} alt={card.name} className="element__photo" onClick={handleCardClick} />
            <div className="element__container">
                <h2 className="element__description">{card.name}</h2>
                <div className="element__like-container">
                    <button className={cardLikeButtonClassName} type="button" aria-label="Лайк" onClick={handleCardLike} />
                    <p className="element__like-counter">{card.likes.length}</p>
                </div>
            </div>
        </li>
    )
};

export default Card;