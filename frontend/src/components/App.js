import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

import Header from "./Header";
import Main from "./Main";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from './ProtectedRoute';
import Footer from "./Footer";
// import PopupWithConfirm from "./PopupWithConfirm";
import ImagePopup from "./ImagePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";

import api from "../utils/api";
import * as auth from "../utils/auth";


function App() {

  const navigate = useNavigate();

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  // const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = React.useState({})
  const [cards, setCards] = React.useState([])
  const [selectedCard, setSelectedCard] = React.useState({})
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  };
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  };
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  };
  // function handleConfirmDelete() {
  //   setIsConfirmPopupOpen(true)
  // };

  function onCardClick(card) {
    setSelectedCard(card)
    setIsImagePopupOpen(true)
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsAddPlacePopupOpen(false)
    // setIsConfirmPopupOpen(false)
    setIsImagePopupOpen(false)
    setIsInfoTooltipPopupOpen(false)
  };
  function handlePopupCloseClick(e) {
    if (e.target.classList.contains('popup__overlay')) {
      closeAllPopups()
    }
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    if (!isLiked) {
      api.like(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
        })
        .catch((err) => console.log(err));
    } else {
      api.dislike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
        })
        .catch((err) => console.log(err));
    }
  };

  function handleCardDelete(card) {
    api.delete(card._id)
      .then(() => {
        setCards((items) => items.filter((c) => c._id !== card._id && c));
      })
      .catch((err) => console.error(err));
  };

  function handleUpdateUser(data) {
    api.handleUserInfo(data)
      .then((newUser) => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  };

  function handleUpdateAvatar(data) {
    api.handleUserAvatar(data)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  };

  function handleAddPlaceSubmit(data) {
    api.addCard(data)
      .then((newCard) => {
        setCards([newCard.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  };

  function handleRegister({ password, email }) {
    auth.register({ password, email })
      .then(res => {
        if (!res || res.statusCode === 400) throw new Error(`Ошибка: ${res.message}`);
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(true);
        navigate('/sign-in')
        return res;
      })
      .catch(err => {
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(false);
        return err;
      })
  };

  function handleLogin({ password, email }) {
    auth.authorize({ password, email })
      .then(res => {
        if (!res || res.statusCode === 400 || res.statusCode === 401) throw new Error(`Ошибка: ${res.message}`);
        if (res.token) {
          setIsInfoTooltipPopupOpen(true);
          setIsSuccess(true);
          setLoggedIn(true);
          localStorage.setItem('jwt', res.token);
          navigate('/')
        };
      })

      .catch(err => {
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(false);
        return err;
      })
  };

  function handleSignOut() {
    localStorage.removeItem('jwt');
    setEmail('');
    setLoggedIn(false);
    navigate('/sign-in');
  };

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.data.email);
          navigate("/");
        })
        .catch((err) => {
          if (err.status === 401) {
            console.log("401 — Токен не передан или передан не в том формате");
          }
          console.log("401 — Переданный токен некорректен");
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getCards()])
      .then(resData => {
        const [userData, cardList] = resData;
        setCurrentUser(userData.data);
        setCards(cardList.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      })
  }
}, [loggedIn]);


useEffect(() => {
  if (isEditProfilePopupOpen || isEditAvatarPopupOpen || isAddPlacePopupOpen || isImagePopupOpen || isInfoTooltipPopupOpen || selectedCard) {
    function handleEsc(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    }
  }
}, [isEditProfilePopupOpen, isEditAvatarPopupOpen, isAddPlacePopupOpen, isImagePopupOpen, isInfoTooltipPopupOpen, selectedCard]);


return (

  <CurrentUserContext.Provider value={currentUser}>
    <div className="body">
      <div className="page">
        <Header
          loggedIn={loggedIn}
          onSignOut={handleSignOut}
          userEmail={email} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ProtectedRoute
                  component={Main}
                  loggedIn={loggedIn}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  cards={cards}
                  onCardClick={onCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              </>
            }
          />
          <Route path='/sign-in'
            element={<Login
              onSubmit={handleLogin} />}
          />
          <Route path='/sign-up'
            element={<Register onSubmit={handleRegister} />}
          />
        </Routes>
        <Footer />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onSubmit={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onSubmit={handleUpdateAvatar}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onSubmit={handleUpdateUser}
        />
        {/* <PopupWithConfirm
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            onCloseClick={handlePopupCloseClick}
          /> */}
        <ImagePopup
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          card={selectedCard}
        />
        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          isSuccess={isSuccess}
        />
      </div>
    </div>
  </CurrentUserContext.Provider>

)
}

export default App;
