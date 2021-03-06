import {LocationContext, ModalContext, Navigation} from "../Contexts";
import {ModalRoot, ModalCard, Input, Button, Snackbar} from "@vkontakte/vkui";
import React, {useContext, useRef} from "react";
import Avatar from "@vkontakte/vkui/dist/components/Avatar/Avatar";
import Icon16Done from "@vkontakte/icons/dist/16/done";


const AddModal = () => {
    const {activeAddModal, goBack} = useContext(Navigation)
    const {photoCard, photoCaptionIndex, photoCaptions, userPhotos, setUserPhotos} = useContext(ModalContext)
    const {setLocationSnackbar} = useContext(LocationContext)

    const inputRef = useRef(null)

    function deletePhoto(e) {
        const tempPhotos = userPhotos.slice()

        tempPhotos.splice(e.currentTarget.dataset.delete, 1)
        setUserPhotos(tempPhotos)
        goBack()
    }

    return(
        <ModalRoot activeModal={activeAddModal} onClose={goBack}>
            <ModalCard id="photo_modal" onClose={goBack}>

                <div
                    className="preview-box"
                >
                    <img
                        src={photoCard}
                        className="preview-img"
                        alt='uploaded by user'
                    />
                </div>

                {/*<Input*/}
                {/*    placeholder={photoCaptions[photoCaptionIndex] ? photoCaptions[photoCaptionIndex] : "Что изображено на фото?"}*/}
                {/*    getRef={inputRef}*/}
                {/*/>*/}

                {/*<Button*/}
                {/*    size='xl'*/}
                {/*    stretched*/}
                {/*    className='yellow-gradient'*/}
                {/*    style={{marginTop: '10px'}}*/}
                {/*    data-caption={photoCaptionIndex}*/}
                {/*    onClick={() => {*/}
                {/*        photoCaptions[photoCaptionIndex] = inputRef.current.value || photoCaptions[photoCaptionIndex]*/}
                {/*        goBack()*/}
                {/*        setLocationSnackbar(*/}
                {/*            <Snackbar*/}
                {/*                layout="vertical"*/}
                {/*                onClose={() => setLocationSnackbar(null)}*/}
                {/*                before={*/}
                {/*                <Avatar*/}
                {/*                    size={24}*/}
                {/*                    style={{background: 'linear-gradient(to left, #F2C94C, #F2994A)'}}*/}
                {/*                >*/}
                {/*                    <Icon16Done fill="#fff" width={14} height={14} />*/}
                {/*                </Avatar>}*/}
                {/*            >*/}
                {/*                Подпись к фотографии изменена*/}
                {/*            </Snackbar>*/}
                {/*        )*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Сохранить*/}
                {/*</Button>*/}

                <Button
                    size='xl'
                    stretched
                    style={{marginTop: '10px', backgroundColor: "var(--red)"}}
                    data-delete={photoCaptionIndex}
                    onClick={(e) => {
                        deletePhoto(e)
                    }}
                >
                    Удалить
                </Button>
            </ModalCard>
        </ModalRoot>
    )
}


export default AddModal;