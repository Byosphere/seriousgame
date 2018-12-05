import * as React from 'react';
import './simplestorylist.css';
import { CardHeader, Card, List, ListItem, ListItemText, ListItemIcon, Tooltip, ListItemSecondaryAction, IconButton, Menu, MenuItem, Avatar, Divider } from '@material-ui/core';
import T from 'i18n-react';
import { PlaylistAdd, MoreVert, ClearAll } from '@material-ui/icons';
import { connect } from 'react-redux';
import { selectCurrentStory, selectCurrentAction } from 'src/actions/storyActions';
import Story from 'src/interfaces/Story';
import { displayConfirmDialog } from 'src/actions/snackbarActions';
import { deleteStory } from '../../utils/api';
import { ORANGE } from 'src/utils/constants';

interface Props {
    stories: Array<Story>
    selectCurrentStory: Function
    selectCurrentAction: Function
    displayConfirmDialog: Function
    selectedStory: Story
    editedStory: Story
    saving: boolean
    toggleRetract: Function
}

interface State {
    menuEl: Array<any>
    retracted: boolean
}

class SimpleStoryList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            menuEl: [],
            retracted: false
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
                    deleteStory(this.props.stories[i], (err: any) => {
                        if (err) console.log(err);
                    });
                }
                this.props.stories.splice(i, 1);
                if (this.props.stories[i - 1]) {
                    this.selectStory(this.props.stories[i - 1]);
                } else if (this.props.stories[i + 1]) {
                    this.selectStory(this.props.stories[i + 1]);
                } else {
                    this.selectStory(this.props.stories[0]);
                }
                this.forceUpdate();
            }
        });
    }

    public toggleRetract() {
        this.setState({ retracted: !this.state.retracted });
        this.props.toggleRetract();
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
            <Card className={this.state.retracted ? " simple-story-list small" : "simple-story-list large"}>
                {!this.state.retracted && <CardHeader
                    title={T.translate('story.list')}
                    component="h2"
                />}
                <Tooltip title={this.state.retracted ? T.translate('generic.expand') : T.translate('generic.shrink') }>
                    <IconButton className="shrink" onClick={() => this.toggleRetract()}>
                        <ClearAll />
                    </IconButton>
                </Tooltip>
                <List className="story-list" dense>
                    {this.props.stories.length === 0 && <ListItem style={{ opacity: 0.5 }}>
                        <ListItemText primary={T.translate('story.nostory')} />
                    </ListItem>}
                    {this.props.stories.map((story, i) => {
                        if (story && !this.state.retracted) return (
                            <ListItem onClick={() => { this.selectStory(story) }} selected={this.props.selectedStory && this.props.selectedStory.id === story.id} button key={i}>
                                {!story.fromData && <span className="unsaved-story"></span>}
                                <ListItemText primary={story.name} secondary={story.filename ? '(' + story.filename + ')' : ''} />
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
                        else if (story && this.state.retracted) return (
                            <ListItem style={{ padding: "5px" }} onClick={() => { this.selectStory(story) }} selected={this.props.selectedStory && this.props.selectedStory.id === story.id} button key={i}>
                                <Avatar style={{ backgroundColor: this.props.selectedStory && this.props.selectedStory.id === story.id ? ORANGE : "#bdbdbd" }}>{story.name.charAt(0).toUpperCase() + story.name.charAt(1).toLowerCase()}</Avatar>
                            </ListItem>
                        )
                        else return null;
                    })}
                    <Divider />
                    {!this.state.retracted && <ListItem onClick={() => { this.createNewStory() }} button className="add-story">
                        <ListItemText
                            primary={T.translate('story.add')} />
                        <ListItemIcon>
                            <PlaylistAdd color="primary" />
                        </ListItemIcon>
                    </ListItem>}
                    {this.state.retracted && <ListItem style={{ padding: "5px" }} onClick={() => { this.createNewStory() }} button className="add-story">
                        <Avatar style={{ backgroundColor: ORANGE }}>
                            <PlaylistAdd color="secondary" />
                        </Avatar>
                    </ListItem>}
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