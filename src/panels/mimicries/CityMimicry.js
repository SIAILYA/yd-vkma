import React, {useContext, useEffect, useState} from "react";
import bridge from "@vkontakte/vk-bridge";

import {Group, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, Search, SimpleCell} from "@vkontakte/vkui";

import {Navigation, LocationContext} from "../../Contexts";
import Header from "@vkontakte/vkui/dist/components/Header/Header";
import Div from "@vkontakte/vkui/dist/components/Div/Div";


const CityChoosePanel = ({id}) => {
    const {goBack, accessToken} = useContext(Navigation)
    const {citiesList, setCity, selectedCountry, setUniversity} = useContext(LocationContext)
    const [searchValue, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [intervalId, setIntervalId] = useState(0)

    useEffect(() => {
        clearTimeout(intervalId)
        if (searchValue){
            setLoading(true)
            setIntervalId(setTimeout(() => {
                bridge.send(
                    "VKWebAppCallAPIMethod",
                    {
                        "method": "database.getCities",
                        "request_id": "getCities",
                        "params": {
                            "country_id": selectedCountry.id,
                            "q": searchValue,
                            "need_all": true,
                            "v": "5.124",
                            "access_token": accessToken,
                        }
                }).then(() => {
                    setLoading(false);
                })
            }, 600))
        } else {
            bridge.send(
                "VKWebAppCallAPIMethod",
                {
                    "method": "database.getCities",
                    "request_id": "getCities",
                    "params": {
                        "country_id": selectedCountry.id,
                        "v": "5.124",
                        "access_token": accessToken,
                    }
                }).then(() => {
                setLoading(false);
            })
        }
    }, [searchValue])

    const onBack = (city) => {
        bridge.send(
            "VKWebAppCallAPIMethod",
            {
                "method": "database.getUniversities",
                "request_id": "getUniversities",
                "params": {
                    "country_id": selectedCountry.id,
                    "city_id": city,
                    "count": 100,
                    "v": "5.124",
                    "access_token": accessToken,
                }
            })
        bridge.send(
            "VKWebAppCallAPIMethod",
            {
                "method": "database.getCities",
                "request_id": "getCities",
                "params": {
                    "country_id": selectedCountry.id,
                    "v": "5.124",
                    "access_token": accessToken,
                }
            })
    }

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack className="yellow-gradient-text" onClick={goBack}/>}
            >Выбор города</PanelHeader>
            <Search value={searchValue} onChange={e => {setSearch(e.target.value.substr(0, 100))}}/>
            {
                !loading && citiesList.filter(({title}) => title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1).length === 0 &&
                <Div>
                    <Header mode="secondary" className="header-centered">Ничего не нашлось</Header>
                </Div>
            }
            {!loading ?
                <Group>
                    {
                        citiesList
                            .filter(({title}) => title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
                            .map((item, index) => {
                                return (
                                    <SimpleCell
                                        onClick={() => {
                                            goBack();
                                            setCity(item);
                                            setUniversity('')
                                            onBack(item.id)
                                        }}
                                        key={index}
                                        expandable
                                    >
                                        {item.title}
                                    </SimpleCell>
                                )
                            })
                    }
                </Group>
                :
                <PanelSpinner/>
            }
        </Panel>
    )
}


export default CityChoosePanel;
