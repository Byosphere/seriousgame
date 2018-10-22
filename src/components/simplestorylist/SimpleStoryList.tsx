import * as React from 'react';
import './simplestorylist.css';
import { CardHeader, Card, List, ListItem, ListItemText, ListItemIcon, Button } from '@material-ui/core';
import T from 'i18n-react';
import { Story } from '../../interfaces/Story';
import { PlaylistAdd } from '@material-ui/icons';

interface Props {
    stories: Array<Story>
    select: Function
}

interface State {
    selectedStory: Story
}

class SimpleStoryList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedStory: props.stories.filter(el => el != null)[0]
        }
    }

    selectStory(story: Story) {
        this.setState({ selectedStory: story });
        this.props.select(story);
    }

    public render() {
        return (
            <Card className="simple-story-list">
                <CardHeader
                    title={T.translate('story.list')}
                    component="h2"
                />
                <List dense>
                    {this.props.stories.map(story => {
                        if (story) return (
                            <ListItem onClick={() => { this.selectStory(story) }} selected={this.state.selectedStory && this.state.selectedStory.id === story.id} button key={story.id}>
                                <ListItemText
                                    primary={story.name} />
                            </ListItem>
                        )
                        else return null;
                    })}
                    <ListItem button className="add-story">
                        <ListItemText
                            primary={T.translate('story.add')} />
                        <ListItemIcon>
                            <PlaylistAdd />
                        </ListItemIcon>
                    </ListItem>
                </List>
            </Card>
        );
    }
}

export default SimpleStoryList;