import React from 'react'
import "./ConfirmModal.css";

function ConfirmModal(props) {
    const closeModal = () => {
        props.setShowModal(false);
    };

    return (
    <>
        {props.showFlag ? ( //showFlagがtrueのときにモーダルを表示
            <div className="ModalOverlay" >
                <div className="ModalContent">
                    <h2>{props.content || "確認"}</h2>
                    <p>本当に{props.content || "この操作"}をしますか？</p>
                    <button className="ConfirmButton">はい</button>
                    <button className="CancelButton" onClick={closeModal}>いいえ</button>
                </div>
            </div>
        ) : ( //showFlagがfalseのときは何も表示しない
        <></>
        ) }
    </>
);
};

export default ConfirmModal