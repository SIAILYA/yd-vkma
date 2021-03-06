import {
    Button,
    Div,
    FixedLayout,
    Group, Header,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Placeholder,
    SimpleCell
} from "@vkontakte/vkui";
import Icon28DoneOutline from "@vkontakte/icons/dist/28/done_outline";
import Icon56ErrorOutline from "@vkontakte/icons/dist/56/error_outline";
import React, {useContext} from "react";
import {LocationContext, Navigation, ReviewsContext} from "../Contexts";


const DormitoryPanel = ({id}) => {
    const {go, goBack} = useContext(Navigation)
    const {dormitoryList, setDormitory, selectedDormitory} = useContext(LocationContext)
    const {clearOnChangeDormitory} = useContext(ReviewsContext)

    return(
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack className="yellow-gradient-text" onClick={goBack}/>}>Выбор общежития</PanelHeader>

            {
                dormitoryList.length > 0 ?
                    <div style={{marginBottom: "10vh"}}>
                        <Div className='text-center'>
                            <Button
                                mode='outline'
                                style={{color: 'var(--yellow)!important'}}
                                onClick={go}
                                data-goto='addPanel_custom_dormitory_panel'
                            >
                                Общежития нет в списке?
                            </Button>
                        </Div>
                        <Group header={<Header mode="secondary">Выберите общежитие</Header>}>
                            {
                                dormitoryList.map((item, index) => {
                                    delete item.grades;
                                    delete item.coordinates;
                                    delete item.info;
                                    delete item.photos;
                                    delete item.rating;

                                    return (
                                        <SimpleCell
                                            onClick={() => {
                                                setDormitory(item)
                                                if (selectedDormitory !== item){
                                                    clearOnChangeDormitory()
                                                }
                                            }}
                                            key={index}
                                            after={selectedDormitory.id === item.id ? <Icon28DoneOutline /> : null}
                                            description={item.address}
                                        >
                                            {item.title}
                                        </SimpleCell>
                                    )
                                })
                            }
                        </Group>
                        <Header className="header-centered" mode="secondary">Или</Header>
                        <Div style={{margin: "auto", textAlign: "center"}}>
                            <Button
                                size="xl"
                                mode="primary"
                                className='yellow-gradient'
                                onClick={go}
                                data-goto='addPanel_custom_dormitory_panel'
                            >
                                Другое общежитие
                            </Button>
                        </Div>
                    </div>
                    :
                    <Div>
                        <Placeholder
                            icon={<Icon56ErrorOutline style={{color: 'var(--yellow)'}}/>}
                            header={'Мы не нашли общежитий'}
                            action={ <Button
                                size="xl"
                                mode="primary"
                                className='yellow-gradient'
                                onClick={go}
                                data-goto='addPanel_custom_dormitory_panel'
                            >
                                Указать адрес
                            </Button>}
                        >
                            Введите адрес вручную
                        </Placeholder>
                    </Div>
            }

            <FixedLayout vertical="bottom">
                <Div>
                    <Button
                        size='xl'
                        stretched
                        className='yellow-gradient'
                        data-goto='addPanel_grades_panel'
                        onClick={go}
                        disabled={!(selectedDormitory)}
                    >
                        Дальше
                    </Button>
                </Div>
            </FixedLayout>
        </Panel>
    )
}

export default DormitoryPanel;