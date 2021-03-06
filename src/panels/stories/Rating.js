import React, {useContext} from "react";
import {
    Avatar,
    Group,
    List,
    Panel,
    PanelHeader, PanelHeaderButton, PanelSpinner,
    PullToRefresh,
    Separator,
    SimpleCell,
    Subhead
} from "@vkontakte/vkui";
import {Navigation, ReviewsContext} from "../../Contexts";
import CircularProgressBar from "../components/CircleProgress";
import {Icon28RefreshOutline, Icon56CameraOffOutline} from "@vkontakte/icons";


export function getPostfix(length) {
    if (length in [2, 3, 4] || length % 10 in [2, 3, 4]){
        return 'а'
    }
    return 'ов'
}


const Rating = () => {
    const {go} = useContext(Navigation)
    const {dormitoryRating, fetchRating, ratingLoading, fetchDormitoryReviews} = useContext(ReviewsContext)


    return (
        <Panel id="rating_panel">
            <PanelHeader left={<PanelHeaderButton onClick={() => {fetchRating()}}><Icon28RefreshOutline className="yellow-gradient-text"/></PanelHeaderButton>}>Рейтинг</PanelHeader>
            {
                ratingLoading && dormitoryRating.length === 0 &&
                <PanelSpinner/>
            }
            <Group>
                <List>
                    {
                        dormitoryRating.sort((a, b) => {return(a.rating > b.rating ? -1 : 1)}).map((item, index, array) => {
                            return(
                                <div key={index}>
                                    <SimpleCell
                                        description={item.address}
                                        multiline
                                        before={
                                            item.photos[0] ?
                                                <Avatar size={48} src={item.photos[0]}/> :
                                                <Avatar size={48}>
                                                    <Icon56CameraOffOutline className="yellow-gradient-text" size={120}/>
                                                </Avatar>
                                        }
                                        after={
                                            <CircularProgressBar
                                                strokeWidth="4"
                                                sqSize="40"
                                                percentage={Math.round(item.rating / 5 * 100)}
                                                xs={true}
                                            />
                                        }
                                        onClick={() => {
                                            fetchDormitoryReviews(item.id, () => {
                                                go({currentTarget: {dataset: {goto: "reviewPanel_dormitory_reviews_panel"}}})
                                            })
                                        }
                                        }
                                    >
                                        <Subhead
                                            weight="medium"
                                        >
                                            {item.title}
                                        </Subhead>
                                        {typeof(item.university_title) === 'string' ? item.university_title : item.university_title.length + " ВУЗ" + getPostfix(item.university_title.length) }
                                    </SimpleCell>
                                    {
                                        index !== array.length - 1 &&
                                        <Separator/>
                                    }
                                </div>
                            )
                        })
                    }
                </List>
            </Group>
        </Panel>
    )
}

export default Rating;