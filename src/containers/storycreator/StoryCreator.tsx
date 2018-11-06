import * as React from 'react';
import './storycreator.css';
import T from 'i18n-react';
import SimpleStoryList from 'src/components/simplestorylist/SimpleStoryList';
import PlayerInterfaces from 'src/components/playerinterfaces/PlayerInterfaces';
import ActionsTimeline from 'src/components/actionstimeline/ActionsTimeline';
import { Card, TextField, Button } from '@material-ui/core';
import { Save } from '@material-ui/icons';
import Story from 'src/interfaces/Story';
import { connect } from 'react-redux';
import { selectCurrentStory } from 'src/actions/storyActions';
import { displaySnackbar } from 'src/actions/snackbarActions';
import Loader from 'src/components/loader/Loader';

interface Props {
    stories: Array<Story>
    roles: Array<Role>
    selectCurrentStory: Function
    selectedStory: Story
    initialStory: Story
    displaySnackbar: Function
}

interface State {
    saving: boolean
}

class StoryCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.props.selectCurrentStory(props.stories[0]);
        this.state = {
            saving: false
        }
    }

    public handleChange(event: any, name: string) {
        let selectedStory = this.props.selectedStory;
        selectedStory[name] = event.target.value;
        if (name === "nbPlayers" && this.props.selectedStory.interfaces.length > event.target.value) {
            selectedStory.interfaces.length = event.target.value;
        }
        this.forceUpdate();
    }

    public saveStory() {
        // if (this.props.selectedStory.equalsTo(this.props.initialStory)) {
        //     this.props.displaySnackbar(T.translate('story.nochanges'));
        //     return;
        // }

        if (this.props.selectedStory.isValid(this.props.roles)) {
            this.setState({ saving: true });
            this.props.selectedStory.save((err: any) => {
                this.setState({ saving: false });
                if (err) {
                    this.props.displaySnackbar(err);
                } else {
                    this.props.displaySnackbar(T.translate('story.saved'));
                }
            });
        } else {
            this.props.displaySnackbar(this.props.selectedStory.errorMessage);
        }
    }

    public render() {

        if (this.props.selectedStory) {
            return (
                <div className="story-creator">
                    <SimpleStoryList stories={this.props.stories} editedStory={this.props.selectedStory} saving={this.state.saving} />
                    <Card className="story-details">
                        <div style={{ display: "flex", alignItems: "center", flex: "1", marginRight: "20px" }}>
                            <TextField
                                id="name"
                                label={T.translate('story.name')}
                                value={this.props.selectedStory.name}
                                onChange={evt => this.handleChange(evt, 'name')}
                                style={{ marginRight: "10px", minWidth: "140px" }}
                            />
                            <TextField
                                id="nbPlayers"
                                label={T.translate('story.nbplayers')}
                                value={this.props.selectedStory.nbPlayers}
                                onChange={evt => this.handleChange(evt, 'nbPlayers')}
                                type="number"
                                inputProps={{ min: "1", max: "10" }}
                                style={{ marginRight: "10px", minWidth: "106px" }}
                            />
                            <TextField
                                id="description"
                                label={T.translate('story.description')}
                                value={this.props.selectedStory.description}
                                onChange={evt => this.handleChange(evt, 'description')}
                                multiline
                                rowsMax="3"
                                fullWidth
                            />
                        </div>
                        <div>
                            <Button disabled={this.state.saving} onClick={() => { this.saveStory() }} style={{ marginRight: "10px" }} variant="outlined" color="primary" ><Save style={{ marginRight: "5px" }} /> {T.translate('generic.save')}</Button>
                        </div>
                    </Card>
                    <PlayerInterfaces story={this.props.selectedStory} roles={this.props.roles} />
                    <ActionsTimeline actions={this.props.selectedStory.actions} />
                </div>
            );
        } else if (this.props.stories.length === 0) {
            return (
                <div className="story-creator">
                    <SimpleStoryList stories={this.props.stories} editedStory={this.props.selectedStory} saving={this.state.saving}/>
                    <Card className="no-stories">
                        <p>{T.translate("story.create")}</p>
                    </Card>
                </div>
            );
        } else {
            return (
                <Loader textKey='generic.loading' />
            );
        }
    }
}
function mapStateToProps(state: any) {
    return {
        selectedStory: state.story.story,
        initialStory: state.story.initialStory
    }
}

export default connect(mapStateToProps, { selectCurrentStory, displaySnackbar })(StoryCreator);