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

interface Props {
    stories: Array<Story>
    roles: Array<Role>
    selectCurrentStory: Function
    selectedStory: Story
    displaySnackbar: Function
}

interface State {
    selectedStory: Story
    saving: boolean
}

class StoryCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.props.selectCurrentStory(props.stories[0]);
        this.state = {
            selectedStory: null,
            saving: false
        }
    }

    public handleChange(event: any, name: string) {
        let selectedStory = this.state.selectedStory;
        selectedStory[name] = event.target.value;
        if (name === "nbPlayers" && this.state.selectedStory.interfaces.length > event.target.value) {
            selectedStory.interfaces.length = event.target.value;
        }
        this.setState({
            selectedStory
        });
    }

    static getDerivedStateFromProps(props: Props, state: State) {
        if (!state.selectedStory || state.selectedStory.id !== props.selectedStory.id) {
            return {
                selectedStory: props.selectedStory
            }
        }
        return null;
    }

    public saveStory() {
        if (this.props.selectedStory.isValid()) {
            this.setState({ saving: true });
            this.props.selectedStory.save((err: any) => {
                this.setState({ saving: false });
                if(err) {
                    this.props.displaySnackbar(err);
                } else {
                    this.props.displaySnackbar(T.translate('story.saved'));
                }
            });
        }
    }

    public render() {
        if (!this.props.selectedStory) return null;
        return (
            <div className="story-creator">
                <SimpleStoryList stories={this.props.stories} editedStory={this.state.selectedStory} />
                <Card className="story-details">
                    <div style={{ display: "flex", alignItems: "center", flex: "1", marginRight: "20px" }}>
                        <TextField
                            id="name"
                            label={T.translate('story.name')}
                            value={this.state.selectedStory.name}
                            onChange={evt => this.handleChange(evt, 'name')}
                            style={{ marginRight: "10px", minWidth: "140px" }}
                        />
                        <TextField
                            id="nbPlayers"
                            label={T.translate('story.nbplayers')}
                            value={this.state.selectedStory.nbPlayers}
                            onChange={evt => this.handleChange(evt, 'nbPlayers')}
                            type="number"
                            inputProps={{ min: "1", max: "10" }}
                            style={{ marginRight: "10px", minWidth: "106px" }}
                        />
                        <TextField
                            id="description"
                            label={T.translate('story.description')}
                            value={this.state.selectedStory.description}
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
                <PlayerInterfaces story={this.state.selectedStory} roles={this.props.roles} />
                <ActionsTimeline actions={this.props.selectedStory.actions} />
            </div>
        );
    }
}
function mapStateToProps(state: any) {
    return {
        selectedStory: state.story.story
    }
}

export default connect(mapStateToProps, { selectCurrentStory, displaySnackbar })(StoryCreator);