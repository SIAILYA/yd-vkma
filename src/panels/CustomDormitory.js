import {
    Button,
    Div,
    FixedLayout,
    FormLayout,
    FormLayoutGroup, FormStatus,
    Input,
    Panel,
    PanelHeader,
    PanelHeaderBack
} from "@vkontakte/vkui";
import GoogleMapReact from "google-map-react";
import React, {useContext, useEffect, useState} from "react";
import {LocationContext, Navigation} from "../Contexts";
import Icon36HomeOutline from "@vkontakte/icons/dist/36/home_outline";


const CustomDormitoryPanel = ({id}) => {
    const {goBack} = useContext(Navigation)
    const {
        setCoordinates, customCoordinates,
        setDormitory, customTitle, customAddress,
        setDormitoryList, dormitoryList,
        setAddress, setTitle} = useContext(LocationContext)
    const [inList, setInList] = useState(false)

    const GoogleMap = () => (
        <div
            style={{
                background: 'white',
                padding: '10px 10px',
                display: 'inline-flex',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '100%',
                transform: 'translate(-50%, -50%)'}}
        >
            <Icon36HomeOutline style={{color: 'var(--yellow)'}}/>
        </div>
    );

    useEffect(() => {
        setInList(false)
        dormitoryList.forEach((item) => {
            if (item.title === customTitle || item.address === customAddress){
                setInList(true)
            }
        })
    }, [customTitle, customAddress])


    return(
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack className="yellow-gradient-text" onClick={goBack}/>}>
                Ввод адреса
            </PanelHeader>

            <div style={{marginBottom: "20vh"}}>
                <Div>
                    <FormStatus mode='default' header='Общежитие не нашлось в списке?'>
                        База общежитий постоянно растет благодаря нашим пользователям.
                        Если не нашли своего общежития в списке - побудьте частью нашего сообщества и укажите, пожалуйста, его название и адрес вручную.
                        Общежитие будет проверено вместе с отзывом и добавлено в базу!
                    </FormStatus>
                </Div>

                <FormLayout>
                    <FormLayoutGroup top="Название/номер общежития">
                        <Input type='text'
                               value={customTitle}
                               onChange={e => {
                                   console.log(e.currentTarget.value)
                                   setTitle(e.currentTarget.value.trimStart().substr(0, 100))
                               }}
                               name='custom_title'
                               placeholder="Общежитие №1"
                        />
                    </FormLayoutGroup>
                    <FormLayoutGroup top="Адрес общежития"
                                     // bottom="Введите адрес общежития"
                    >
                        <Input type='text'
                               value={customAddress}
                               onChange={e => {
                                   console.log(e.currentTarget.value)
                                   setAddress(e.currentTarget.value.trimStart().substr(0, 100))
                               }}
                               placeholder="Москва, улица Пушкина, 7к3"
                               name='custom_address'
                        />
                    </FormLayoutGroup>
                </FormLayout>
            </div>
            {/*<Div style={{height: '30vh', borderRadius: '15px', overflow: 'hidden', padding: 0, margin: '12px'}}>*/}
            {/*    <GoogleMapReact*/}
            {/*        bootstrapURLKeys={{key: 'AIzaSyCTGj2Q0pCF-W-VAh8i2GImSUhXuxZF8yI'}}*/}
            {/*        defaultCenter={{*/}
            {/*            'lat': 59.95,*/}
            {/*            'lng': 30.33*/}
            {/*        }}*/}
            {/*        defaultZoom={11}*/}
            {/*        onClick={({lat, lng}) => setCoordinates({lat: lat, lng: lng})}*/}
            {/*    >*/}
            {/*        <GoogleMap*/}
            {/*            lat={customCoordinates.lat}*/}
            {/*            lng={customCoordinates.lng}*/}
            {/*        />*/}

            {/*    </GoogleMapReact>*/}
            {/*</Div>*/}

            <FixedLayout vertical='bottom'>
                <Div>
                    <Button
                        size='xl'
                        stretched
                        className='yellow-gradient'
                        data-goto='addPanel_grades_panel'
                        onClick={() => {
                            const randomId = Math.random()
                            setDormitory(
                                {
                                    'id': randomId,
                                    'title': customTitle,
                                    'address': customAddress,
                                    'coordinates': customCoordinates
                                });
                            setDormitoryList([...dormitoryList,
                                {
                                    'id': randomId,
                                    'title': customTitle,
                                    'address': customAddress,
                                    'coordinates': customCoordinates
                                }
                            ])
                            goBack();
                            setAddress('');
                            setTitle('');
                        }
                        }
                        disabled={!(customAddress && customTitle && !inList)}
                    >
                        Подтвердить
                    </Button>
                </Div>
            </FixedLayout>
        </Panel>
    )
}

export default CustomDormitoryPanel;