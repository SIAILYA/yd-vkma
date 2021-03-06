import React, {useContext} from "react";
import bridge from '@vkontakte/vk-bridge';

import {
    Panel,
    Div,
    Button,
    FixedLayout,
    FormLayoutGroup,
    SelectMimicry,
    FormLayout,
    PanelHeader
} from "@vkontakte/vkui";

import Icon24UserOutgoing from "@vkontakte/icons/dist/24/user_outgoing";

import {LocationContext, Navigation} from "../../Contexts";
import {FailedSnackbar, SuccessSnackbar} from "../components/Snackbars";


const WhereStudyPanel = ({id}) => {
    const {fetchedUser, go, setOnboardingSnackbar, onboardingSnackbar, onboardingShowed, history, onOnboardingEnd}  = useContext(Navigation)
    const {setActiveView} = useContext(Navigation)
    const {
        selectedCountry, selectedCity, selectedUniversity,
        setCountry, setCity, setEducation, setUniversity
    } = useContext(LocationContext)

    return(
        <Panel id={id}>
            <PanelHeader separator={false} transparent={true}/>
            <Div>
                <div className="yellow-gradient-text where-are-you" style={{textAlign: "center"}}>
                    А где учитесь?
                </div>
                <div className="description-header" style={{textAlign: "center"}}>
                    Последнее уточнение
                </div>
                <div style={{textAlign: "center", marginTop: "10px"}}>
                    Не волнуйтесь, мы никому не расскажем! Эта информация нужна только для вашего удобства!
                </div>
            </Div>

            <FormLayout>
                <FormLayoutGroup bottom="Расскажите, где учитесь">
                    <SelectMimicry
                        top="Выберите страну"
                        placeholder="Страна не выбрана"
                        onClick={go}
                        data-goto='onboardingPanel_country_choose'
                    >
                        {selectedCountry.title}
                    </SelectMimicry>

                    <SelectMimicry
                        top="Выберите город"
                        placeholder="Город не выбран"
                        onClick={go}
                        data-goto='onboardingPanel_city_choose'
                        disabled={!selectedCountry}
                    >
                        {selectedCity.title}
                    </SelectMimicry>

                    <SelectMimicry
                        top="Выберите ВУЗ"
                        placeholder="ВУЗ не выбран"
                        onClick={go}
                        data-goto='onboardingPanel_uni_choose'
                        disabled={!selectedCity}
                    >
                        {selectedUniversity.title}
                    </SelectMimicry>
                </FormLayoutGroup>
            </FormLayout>

            <div style={{display: 'flex', paddingBottom: '20vh'}}>
                <Button
                    mode='outline'
                    style={{color: 'var(--yellow)!important', margin: 'auto'}}
                    onClick={() => {
                        setEducation().then(() => {
                                try {
                                    if (fetchedUser.country.title && fetchedUser.city.title && fetchedUser.university.title) {
                                        setCountry(fetchedUser.country)
                                        setCity(fetchedUser.city)
                                        setUniversity(fetchedUser.university)
                                        setOnboardingSnackbar(<SuccessSnackbar caption="Данные успешно заполнены!"
                                                                             onClose={() => setOnboardingSnackbar('')}
                                                                             duration={1000}/>)
                                    } else {
                                        console.log(fetchedUser)
                                        if (fetchedUser.country.title){
                                            setUniversity('')
                                            setCity('')
                                            setCountry(fetchedUser.country)
                                        }
                                        if (fetchedUser.city.title){
                                            setUniversity('')
                                            setCity(fetchedUser.city)
                                        }
                                        if (fetchedUser.university.title){
                                            setUniversity(fetchedUser.university)
                                        }
                                        setOnboardingSnackbar(<FailedSnackbar caption="В профиле не хватает информации, заполните недостающие поля вручную"
                                                                            onClose={() => setOnboardingSnackbar('')}/>)
                                    }
                                } catch (e) {
                                    setOnboardingSnackbar(<FailedSnackbar caption="Что-то пошло не так... Заполните данные вручную"
                                                                        onClose={() => setOnboardingSnackbar('')}/>)
                                }
                            }
                        )
                    }}
                    before={<Icon24UserOutgoing/>}
                >
                    Заполнить из профиля
                </Button>
            </div>

            <FixedLayout vertical="bottom">
                <Div style={{textAlign: "center", backgroundColor: "var(--background_content)"}}>
                    <Button
                        className="yellow-gradient"
                        size="xl"
                        stretched
                        onClick={() => {
                            onOnboardingEnd()
                            setActiveView("epic_view")
                            bridge.send("VKWebAppStorageSet", {"key": "default_location", "value": JSON.stringify({country: selectedCountry, city: selectedCity, university: selectedUniversity})});
                        }}
                        disabled={
                            !((selectedCountry.title) &&
                            (selectedCity.title))
                        }
                    >
                        Приступить!
                    </Button>
                    <Button
                        size="m"
                        mode='tertiary'
                        style={{marginTop: "10px", color: "var(--yellow)"}}
                        onClick={() => {
                            onOnboardingEnd()
                            setActiveView("epic_view")
                        }}
                    >
                        Пропустить
                    </Button>
                </Div>
            </FixedLayout>
            {onboardingSnackbar}
        </Panel>
    )
}

export default WhereStudyPanel;