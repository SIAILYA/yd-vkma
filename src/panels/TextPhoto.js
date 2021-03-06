import React, {useContext, useEffect, useRef, useState} from "react";
import {useDropzone} from 'react-dropzone';

import {
    Avatar, Button, Caption,
    Card,
    CardScroll, Checkbox,
    Div,
    File,
    FormLayout, FormLayoutGroup,
    FormStatus,
    Panel,
    PanelHeader, Placeholder, Textarea, ScreenSpinner, PanelHeaderBack,
    Alert
} from "@vkontakte/vkui";

import Icon24CameraOutline from '@vkontakte/icons/dist/24/camera_outline';
import Icon56GalleryOutline from '@vkontakte/icons/dist/56/gallery_outline';
import Icon56CameraOffOutline from '@vkontakte/icons/dist/56/camera_off_outline';

import {LocationContext, ModalContext, Navigation, ReviewsContext} from "../Contexts";

import {sendReview, uploadPhotos} from "../Backend";
import {FailedSnackbar} from "./components/Snackbars";


const TextPhotoPanel = ({id}) => {
    const {go, goBack, setPopout, history, setBlock} = useContext(Navigation)
    const {setPhotoCaptionIndex, setPhotoCard, photoCaptions, userPhotos, setUserPhotos} = useContext(ModalContext)
    const {locationSnackbar, setTextReview, textReview, anonReview, setAnon, setLocationSnackbar} = useContext(LocationContext)
    const {setPhotoURLs, review, setUserReviews, clearData} = useContext(ReviewsContext)
    const {getInputProps} = useDropzone();

    const [previews, setPreviews] = useState([])
    const prevUserPhotos = useRef([])
    const textareaRef = useRef('')

    useEffect(() => {
        setPreviews([])
        prevUserPhotos.current = userPhotos
        if (prevUserPhotos.current){
            for (let i = 0; i < prevUserPhotos.current.length; i++){
                const new_preview = URL.createObjectURL(prevUserPhotos.current[i])
                setPreviews(prevState => [...prevState, new_preview])
                photoCaptions.push('')
            }
        }
    }, [userPhotos, photoCaptions])

    return(
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack className="yellow-gradient-text" onClick={goBack}/>}>Отзыв</PanelHeader>

            <Div>
                <FormStatus mode='default' header='Скажите пару слов'>
                    Напишите небольшой отзыв, который увидят все пользователи сервиса.<br/><br/>
                    <i>- О чем написать?</i><br/>
                    - Расскажите о том, как долго добираетесь до места учебы, с какими трудностями столкнулись при заселении,
                    отметьте плюсы и минусы общежития<br/><br/>
                    <b>Не забудьте прикрепить фото - лучше один раз увидеть, чем сто раз услышать!</b>
                </FormStatus>

                {/*{...getRootProps({ className: 'dropzone' })}*/}
                <FormLayout>
                    <FormLayoutGroup bottom={<div style={{textAlign: "right"}}>{textReview.length ? textReview.length : 0}/2000</div>}>
                        <Textarea
                            top="Отзыв об общежитии"
                            placeholder="Я (не) люблю это общежитие за..."
                            value={textReview}
                            getRef={textareaRef}
                            // maxLength="2000"
                            onChange={e => {
                                setTextReview(e.target.value.replaceAll(RegExp("[<>]", "g"), "").substr(0, 2000).trimStart())
                            }}
                        />
                    </FormLayoutGroup>
                </FormLayout>
                    <Div>
                        <div
                            style={{
                                minHeight: '100px',
                                border: 'dashed 3px var(--accent)',
                                borderRadius: '15px',
                                overflow: 'hidden'
                            }}
                        >
                            <Placeholder
                                icon={<Icon56GalleryOutline className="yellow-color"/>}
                                header="Загрузите фотографии"
                                className="upload-photo"
                                action={
                                    <File top="Загрузите фотографии общежития"
                                          className='yellow-gradient'
                                          before={<Icon24CameraOutline />}
                                          controlSize="l"
                                          accept="image/*"
                                          disabled={previews.length >= 5}
                                          onInput={e => {
                                              let inList = false

                                              userPhotos.forEach((item) => {
                                                  if (item.name === e.currentTarget.files[0].name && item.lastModified === e.currentTarget.files[0].lastModified){
                                                      inList = true
                                                  }
                                              })

                                              if (!inList){
                                                setUserPhotos(prev => [...prev, ...e.currentTarget.files])
                                              } else {
                                                  setLocationSnackbar(<FailedSnackbar caption="Вы уже загрузили эту фотографию" onClose={setLocationSnackbar}/>)
                                              }
                                          }}
                                    >
                                        Открыть галерею
                                    </File>
                                }
                            >
                            </Placeholder>
                            <input
                                {...getInputProps()}
                                onInput={e => setUserPhotos(prev => [...prev, ...e.currentTarget.files])}
                            />
                        </div>
                    </Div>
                <FormLayout>
                    <FormLayoutGroup top="Загруженные фото" bottom={previews.length > 0 && "Нажмите на фото чтобы добавить описание"}>
                        {previews.length > 0 ?
                        <CardScroll style={{minHeight: '90px'}}>
                            {
                                previews.map((preview, index) => {
                                    return (
                                        <Card key={index} size='m'>
                                            <Avatar
                                                size={80}
                                                mode="app"
                                                src={preview}
                                                style={{objectFit: 'cover'}}
                                                onClick={() => {
                                                    setPhotoCard(preview)
                                                    setPhotoCaptionIndex(index)
                                                    go({currentTarget: {dataset: {goto: 'addModal_photo_modal'}}})
                                                }}
                                            />
                                        </Card>
                                    )
                                })
                            }
                        </CardScroll>
                        :
                            <Div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                    <Icon56CameraOffOutline className='yellow-color' style={{margin: 'auto'}}/>
                                    <Caption style={{margin: 'auto'}}>Нет загруженных фото</Caption>
                            </Div>
                        }
                    </FormLayoutGroup>
                </FormLayout>

                <FormLayout>
                    <FormLayoutGroup bottom="Ваш отзыв будет обезличен и никто, кроме вас, не узнает об авторстве">
                        <Checkbox value={anonReview} onChange={() => setAnon(prev => !prev)}>
                            Оставить отзыв анонимно
                        </Checkbox>
                    </FormLayoutGroup>
                </FormLayout>

                <Button
                    size="xl"
                    stretched
                    className="yellow-gradient"
                    data-goto="addPanel_preview_review_panel"
                    disabled={!textReview}
                    onClick={() => {
                        setPopout(<ScreenSpinner size='large' />)
                        setBlock(true)
                        if (userPhotos.length > 0){
                            uploadPhotos(userPhotos).then(res => {
                                setPhotoURLs(res.data)
                                review.photos = res.data
                                sendReview(review).then(res => {
                                    setPopout(null)
                                    setBlock(false)
                                    if (res.status === 200){
                                        go({currentTarget: {dataset: {goto: "addPanel_week_panel"}}})
                                        setUserReviews([review])
                                    } else {
                                        setLocationSnackbar(<FailedSnackbar caption="Не удалось выполнить загрузку отзыва на сервер" onClose={setLocationSnackbar}/>)
                                    }
                                }).catch((res) => {
                                    if (res.response) {
                                        if (res.response.status === 429){
                                            setPopout(null)
                                            setBlock(false)
                                            setLocationSnackbar(<FailedSnackbar caption="Слишком много отзывов, давайте продолжим завтра" onClose={setLocationSnackbar}/>)
                                        }
                                    }
                                    else {
                                        setPopout(null)
                                        setBlock(false)
                                        setLocationSnackbar(<FailedSnackbar caption="Не удалось выполнить загрузку отзыва на сервер" onClose={setLocationSnackbar}/>)
                                    }
                                })
                            }).catch((res) => {
                                if (res.response) {
                                    if (res.response.status === 429){
                                        setPopout(null)
                                        setBlock(false)
                                        setLocationSnackbar(<FailedSnackbar caption="Слишком много отзывов, давайте продолжим завтра" onClose={setLocationSnackbar}/>)
                                    }
                                }
                                else {
                                    setPopout(null)
                                    setBlock(false)
                                    setLocationSnackbar(<FailedSnackbar caption="Не удалось выполнить загрузку отзыва на сервер" onClose={setLocationSnackbar}/>)
                                }
                            })
                        } else {
                            sendReview(review).then(res => {
                                setPopout(null)
                                setBlock(false)
                                if (res.status === 200){
                                    go({currentTarget: {dataset: {goto: "addPanel_week_panel"}}})
                                    setUserReviews([review])
                                } else {
                                    setLocationSnackbar(<FailedSnackbar caption="Не удалось выполнить загрузку отзыва на сервер" onClose={setLocationSnackbar}/>)
                                }
                            }).catch((res) => {
                                if (res.response) {
                                    if (res.response.status === 429){
                                        setPopout(null)
                                        setBlock(false)
                                        setLocationSnackbar(<FailedSnackbar caption="Слишком много отзывов, давайте продолжим завтра" onClose={setLocationSnackbar}/>)
                                    }
                                }
                                else {
                                    setPopout(null)
                                    setBlock(false)
                                    setLocationSnackbar(<FailedSnackbar caption="Не удалось выполнить загрузку отзыва на сервер" onClose={setLocationSnackbar}/>)
                                }

                            })
                        }
                    }}
                >
                    Опубликовать
                </Button>
            </Div>
            <Div style={{paddingTop: 0}}>
                <Button
                    size="xl"
                    stretched
                    style={{backgroundColor: "var(--red)"}}
                    onClick={() => {
                        window.history.pushState( {panel: 'addAlert'}, 'addAlert' );
                        history.push( 'addAlert' );
                        setPopout(
                            <Alert
                                actionsLayout="vertical"
                                actions={[{
                                    title: 'Стереть отзыв',
                                    autoclose: true,
                                    mode: 'destructive',
                                    action: () => {
                                        history.splice(history.indexOf("view_add_review_view") - 1, 6)
                                        go({currentTarget: {dataset: {goto: 'view_epic_view'}}})
                                        clearData()
                                    }
                                }, {
                                    title: 'Вернуться к отзыву',
                                    autoclose: true,
                                    mode: 'cancel'
                                }]}
                                onClose={() => {
                                    setPopout(null)
                                    goBack()
                                }}
                            >
                                <h2>Подтвердите действие</h2>
                                <p>Вы уверены, что хотите отменить создание отзыва?</p>
                            </Alert>
                        )
                    }}
                >
                    Отменить публикацию
                </Button>
            </Div>

            {locationSnackbar}
        </Panel>
    )
}

export default TextPhotoPanel;