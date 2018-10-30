import * as React from 'react';
import './simplestorylist.css';
import { CardHeader, Card, List, ListItem, ListItemText, ListItemIcon, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import T from 'i18n-react';
import { PlaylistAdd } from '@material-ui/icons';
import { connect } from 'react-redux';
import { selectCurrentStory } from 'src/actions/storyActions';
import Story from 'src/interfaces/Story';

interface Props {
    stories: Array<Story>
    selectCurrentStory: Function
    selectedStory: Story
    editedStory: Story
}

interface State { }

class SimpleStoryList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public selectStory(story: Story) {
        if (this.props.selectedStory.id !== story.id) {
            this.props.selectCurrentStory(story);
        }
    }

    public createNewStory() {
        let newStory: Story = null;
        if (this.props.stories.length) {
            newStory = new Story(this.props.stories[this.props.stories.length - 1].id + 1);
        } else {
            newStory = new Story(1);
        }
        this.props.stories.push(newStory);
        this.props.selectCurrentStory(newStory);
    }

    public render() {
        return (
            <Card className="simple-story-list">
                <CardHeader
                    title={T.translate('story.list')}
                    component="h2"
                />
                <List dense>
                    {this.props.stories.length === 0 && <ListItem style={{ opacity: 0.5 }}>
                        <ListItemText primary={T.translate('story.nostory')} />
                    </ListItem>}
                    {this.props.stories.map(story => {
                        if (story) return (
                            <ListItem onClick={() => { this.selectStory(story) }} selected={this.props.selectedStory && this.props.selectedStory.id === story.id} button key={story.id}>
                                <ListItemText primary={story.name} />
                            </ListItem>
                        )
                        else return null;
                    })}
                    <ListItem onClick={(event) => { this.createNewStory() }} button className="add-story">
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

function mapStateToProps(state: any) {
    return {
        selectedStory: state.story.story
    }
}

export default connect(mapStateToProps, { selectCurrentStory })(SimpleStoryList);