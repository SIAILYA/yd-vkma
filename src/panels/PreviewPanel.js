import React, {useContext} from "react";
import bridge from '@vkontakte/vk-bridge';

import {
    Button,
    Card,
    Panel,
    PanelHeader,
    Cell,
    Div,
    Avatar,
    Group,
    InfoRow,
    Progress,
    Header,
    FormStatus, CardScroll
} from "@vkontakte/vkui";

import {Navigation, ReviewsContext} from "../Contexts";
import CircularProgressBar from "./components/CircleProgress";


const PreviewPanel = ({id}) => {
    const {review, clearData, fetchUserReviews} = useContext(ReviewsContext)
    const {go, history} = useContext(Navigation)


    return (
        <Panel id={id}>
            <PanelHeader>
                Превью отзыва
            </PanelHeader>
            <Div>
                <FormStatus
                    header="Отзыв уже отправлен на модерацию!"
                >
                    Постараемся как можно быстрее обработать ваш отзыв, чтобы его могли увидеть другие пользователи!
                </FormStatus>
            </Div>
            <Div>
                {
                    review.review &&
                <Card
                    mode="outline"
                >
                    <Div>
                        <Cell
                            before={<Avatar src={review.author_photo}/>}
                            description={review.anonymous ? "Анонимный отзыв" : review.author_role}
                        >
                            {review.author_name} {review.author_surname}
                        </Cell>
                        <Div>
                            <div className="circle-progress-wrap " style={{height: '55px', width: '55px', position: 'relative'}}>
                                <CircularProgressBar
                                    strokeWidth="8"
                                    sqSize="55"
                                    percentage={Math.round(review.review.rating.main / 5 * 100)}
                                    sm={true}
                                />
                            </div>
                        </Div>
                        <Group
                            header={<Header mode="secondary">Оценки</Header>}
                        >
                            <Cell
                                asideContent={review.review.rating.condition}
                            >
                                <InfoRow header="Общее состояние">
                                    <Progress
                                        value={
                                            review.review.rating.condition * 20
                                            // Math.round(Math.random() * 50)
                                        }
                                    />
                                </InfoRow>
                            </Cell>
                            <Cell
                                asideContent={review.review.rating.cost}
                            >
                                <InfoRow header="Цена">
                                    <Progress
                                        value={
                                            review.review.rating.cost * 20
                                        }
                                    />
                                </InfoRow>
                            </Cell>
                            <Cell
                                asideContent={review.review.rating.personal}
                            >
                                <InfoRow header="Персонал">
                                    <Progress
                                        value={
                                            review.review.rating.personal * 20
                                        }
                                    />
                                </InfoRow>
                            </Cell>
                            <Cell
                                asideContent={review.review.rating.location}
                            >
                                <InfoRow header="Расположение">
                                    <Progress
                                        value={
                                            review.review.rating.location * 20
                                        }
                                    />
                                </InfoRow>
                            </Cell>
                            <Cell
                                asideContent={review.review.rating.noise}
                            >
                                <InfoRow header="Шумоизоляция">
                                    <Progress
                                        value={
                                            review.review.rating.noise * 20
                                        }
                                    />
                                </InfoRow>
                            </Cell>
                        </Group>
                        <Group
                            header={<Header mode="secondary">Отзыв</Header>}
                        >
                            <Card

                            >
                                <Div>
                                    {review.review.text}
                                </Div>
                            </Card>
                        </Group>
                        {
                            review.photos.length > 0 &&
                            <Group
                                header={<Header mode="secondary">Фотографии</Header>}
                            >
                                <CardScroll>
                                    {
                                        review.photos.map((photo, index, array) => {
                                            return(
                                                <div style={{marginRight: "10px"}} key={index} onClick={() => {
                                                    bridge.send("VKWebAppShowImages", {"images": array, "start_index": index})

                                                }}>
                                                    <Avatar mode="app" size={80} src={photo} style={{objectFit: 'cover'}}/>
                                                </div>
                                            )
                                        })
                                    }
                                </CardScroll>
                            </Group>
                        }
                    </Div>
                </Card>
                }
            </Div>

            <Div>
                <Button
                    data-goto="view_epic_view"
                    onClick={() => {
                        fetchUserReviews()
                        history.splice(history.indexOf("view_add_review_view") - 1, 8)
                        go({currentTarget: {dataset: {goto: 'view_epic_view'}}})
                        clearData()
                    }}
                    stretched
                    size="xl"
                    className="yellow-gradient"
                >
                    Домой
                </Button>
            </Div>
        </Panel>
    )
}


export default PreviewPanel;
