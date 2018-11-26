import * as React from 'react';
import './simplestorylist.css';
import { CardHeader, Card, List, ListItem, ListItemText, ListItemIcon, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, ListItemSecondaryAction, IconButton, Menu, MenuItem } from '@material-ui/core';
import T from 'i18n-react';
import { PlaylistAdd, MoreVert } from '@material-ui/icons';
import { connect } from 'react-redux';
import { selectCurrentStory, selectCurrentAction } from 'src/actions/storyActions';
import Story from 'src/interfaces/Story';
import { displayConfirmDialog } from 'src/actions/snackbarActions';
import { deleteStory } from '../../utils/api';

interface Props {
    stories: Array<Story>
    selectCurrentStory: Function
    selectCurrentAction: Function
    displayConfirmDialog: Function
    selectedStory: Story
    editedStory: Story
    saving: boolean
}

interface State {
    menuEl: Array<any>
}

class SimpleStoryList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            menuEl: []
        }
    }

    public selectStory(story: Story) {

        if (!story) {
            this.props.selectCurrentStory(null);
        } else if (this.props.selectedStory.id !== story.id) {
            this.props.selectCurrentAction(story.actions[0]);
            this.props.selectCurrentStory(story);
        }
    }

    public openMenu(event: any, id: number) {
        event.stopPropagation();
        let menuEl = this.state.menuEl;
        menuEl[id] = event.currentTarget;
        this.setState({ menuEl });
    }

    public closeMenu(event: any, id: number) {
        event.stopPropagation();
        let menuEl = this.state.menuEl;
        menuEl[id] = null;
        this.setState({ menuEl });
    }

    public createNewStory() {
        let newStory: Story = null;
        if (this.props.stories.length) {
            newStory = new Story(this.props.stories[this.props.stories.length - 1].id + 1);
        } else {
            newStory = new Story(1);
        }
        this.props.stories.push(newStory);
        this.props.selectCurrentAction(newStory.actions[0]);
        this.props.selectCurrentStory(newStory);
    }

    public deleteStory(event: any, i: number) {
        setTimeout(() => {
            let menuEl = this.state.menuEl;
            menuEl[i] = null;
            this.setState({ menuEl });
        }, 2);
        event.stopPropagation();
        this.props.displayConfirmDialog({
            title: T.translate('generic.warning'),
            content: T.translate('story.deletewarning'),
            confirm: () => {
                if (this.props.stories[i].fromData) {
                    deleteStory(this.props.stories[i].id, (err: any) => {
                        if (err) console.log(err);
                    });
                }
                this.props.stories.splice(i, 1);
                if (this.props.stories[i - 1]) {
                    this.selectStory(this.props.stories[i - 1]);
                } else if (this.props.stories[i + 1]) {
                    this.selectStory(this.props.stories[i + 1]);
                } else {
                    this.selectStory(null);
                }
                this.forceUpdate();
            }
        });
    }

    public duplicateStory(event: any, story: Story) {
        event.stopPropagation();
        let newStory = story.duplicate(this.props.stories[this.props.stories.length - 1].id + 1);
        this.props.stories.push(newStory);
        this.props.selectCurrentStory(newStory);
        this.forceUpdate();
    }

    public render() {
        return (
            <Card className="simple-story-list">
                <CardHeader
                    title={T.translate('story.list')}
                    component="h2"
                />
                <List className="story-list" dense>
                    {this.props.stories.length === 0 && <ListItem style={{ opacity: 0.5 }}>
                        <ListItemText primary={T.translate('story.nostory')} />
                    </ListItem>}
                    {this.props.stories.map((story, i) => {
                        if (story) return (
                            <ListItem onClick={() => { this.selectStory(story) }} selected={this.props.selectedStory && this.props.selectedStory.id === story.id} button key={i}>
                                {!story.fromData && <span className="unsaved-story"></span>}
                                <ListItemText primary={story.name} />
                                <ListItemSecondaryAction>
                                    <IconButton aria-owns={this.state.menuEl ? 'menu ' + story.name : null} onClick={event => { this.openMenu(event, i) }} aria-label="More" aria-haspopup="true">
                                        <MoreVert fontSize="small" />
                                    </IconButton>
                                    <Menu
                                        id={"menu " + story.name}
                                        anchorEl={this.state.menuEl[i]}
                                        open={Boolean(this.state.menuEl[i])}
                                        onClose={event => { this.closeMenu(event, i) }}
                                    >
                                        <MenuItem onClick={event => { this.duplicateStory(event, story) }}>{T.translate('generic.duplicate')}</MenuItem>
                                        <MenuItem onClick={event => { this.deleteStory(event, i) }}>{T.translate('generic.delete')}</MenuItem>
                                    </Menu>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                        else return null;
                    })}
                    <ListItem onClick={event => { this.createNewStory() }} button className="add-story">
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

export default connect(mapStateToProps, { selectCurrentStory, selectCurrentAction, displayConfirmDialog })(SimpleStoryList);