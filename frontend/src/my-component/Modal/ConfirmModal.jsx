import React from 'react'
import "./ConfirmModal.css";

function ConfirmModal(props) {
    // console.log(props);
    const closeModal = () => {
        props.setShowModal(false);
    };

    const confirmStatus = () => {
        props.setConfirmStatus(true);
    }

    return (
    <>
        {props.showFlag ? ( //showFlagがtrueのときにモーダルを表示
            <div className="ModalOverlay" >
                <div className="ModalContent">
                    <h2>{props.content || "確認"}</h2>
                    <p>本当に{props.content || "この操作"}をしますか？</p>
                    <button className="button ConfirmButton" onClick={confirmStatus}>はい</button>
                    <button className="button CancelButton" onClick={closeModal}>いいえ</button>
                </div>
            </div>
        ) : ( //showFlagがfalseのときは何も表示しない
        <></>
        ) }
    </>
);
};

export default ConfirmModal