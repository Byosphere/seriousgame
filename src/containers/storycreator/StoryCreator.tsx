import * as React from 'react';
import './storycreator.css';
import T from 'i18n-react';
import SimpleStoryList from 'src/components/simplestorylist/SimpleStoryList';
import PlayerInterfaces from 'src/components/playerinterfaces/PlayerInterfaces';
import ActionsTimeline from 'src/components/actionstimeline/ActionsTimeline';
import { Card, TextField, Button, IconButton, Tooltip, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, Input, FormControl, InputLabel, InputAdornment } from '@material-ui/core';
import { Save, CloudDownload } from '@material-ui/icons';
import Story from 'src/interfaces/Story';
import { connect } from 'react-redux';
import { selectCurrentStory } from 'src/actions/storyActions';
import { displaySnackbar, displayConfirmDialog } from 'src/actions/snackbarActions';
import Loader from 'src/components/loader/Loader';
import Role from 'src/interfaces/Role';
import { exportToJsonFile } from 'src/utils/tools';

interface Props {
    stories: Array<Story>
    roles: Array<Role>
    selectCurrentStory: Function
    selectedStory: Story
    displaySnackbar: Function
    displayConfirmDialog: Function
}

interface State {
    saving: boolean
    filenameDialog: boolean
    retract: boolean
}

class StoryCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.props.selectCurrentStory(props.stories[0]);
        this.state = {
            saving: false,
            filenameDialog: false,
            retract: false
        }
    }

    public handleChange(event: any, name: string) {
        let selectedStory = this.props.selectedStory;
        let value = event.target.value
        if (name === "nbPlayers" && this.props.selectedStory.interfaces.length > parseInt(value)) {
            this.props.displayConfirmDialog({
                title: T.translate('generic.warning'),
                content: T.translate('interface.deletewarning', { playerId: (parseInt(value) + 1) }),
                confirm: () => {
                    selectedStory.interfaces.length = parseInt(value);
                    selectedStory[name] = parseInt(value);
                    this.forceUpdate();
                }
            });
        } else {
            selectedStory[name] = value;
            this.forceUpdate();
        }
    }

    public exportStory() {
        let selectedStoryD = this.props.selectedStory.duplicate(1);
        delete selectedStoryD.id;
        delete selectedStoryD.filename;
        exportToJsonFile(selectedStoryD, this.props.selectedStory.filename);
    }

    private _save() {
        this.props.selectedStory.save((err: any) => {
            this.setState({ saving: false });
            if (err) {
                this.props.displaySnackbar(err);
            } else {
                this.props.displaySnackbar(T.translate('story.saved'));
            }
        });
    }

    public saveStory() {

        if (this.props.selectedStory.isValid(this.props.roles)) {
            this.setState({ saving: true });
            if (this.props.selectedStory.fromData) {
                this._save();
                this.forceUpdate();
            } else {
                this.setState({ filenameDialog: true });
            }

        } else {
            this.props.displaySnackbar(this.props.selectedStory.errorMessage);
        }
    }

    public confirmFilename() {
        this.setState({ filenameDialog: false });
        this.props.selectedStory.filename += ".json";
        this._save();
    }

    public render() {

        if (this.props.selectedStory) {
            return (
                <div className="story-creator" style={this.state.retract ? { gridTemplateColumns: "55px calc(100% - 355px) 300px" } : {}}>
                    <SimpleStoryList toggleRetract={() => this.setState({ retract: !this.state.retract })} stories={this.props.stories} editedStory={this.props.selectedStory} saving={this.state.saving} />
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
                            <Tooltip title={T.translate('generic.export')}>
                                <IconButton disabled={!this.props.selectedStory.filename} onClick={() => { this.exportStory() }} color="primary" aria-label="Export">
                                    <CloudDownload />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Card>
                    <PlayerInterfaces story={this.props.selectedStory} roles={this.props.roles} />
                    <ActionsTimeline actions={this.props.selectedStory.actions} />
                    <Dialog maxWidth="sm" open={this.state.filenameDialog} onClose={() => this.setState({ filenameDialog: false, saving: false })} aria-labelledby="filename-dialog">
                        <DialogTitle id="filename-dialog">{T.translate('generic.filename')}</DialogTitle>
                        <DialogContent>
                            <DialogContentText style={{ marginBottom: "20px" }}>
                                {T.translate('story.filenamedetails')}
                            </DialogContentText>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="filename">{T.translate('story.filename')}</InputLabel>
                                <Input
                                    fullWidth
                                    autoFocus
                                    id="filename"
                                    type="text"
                                    onChange={(evt) => { this.props.selectedStory.filename = evt.target.value; this.forceUpdate(); }}
                                    value={this.props.selectedStory.filename}
                                    endAdornment={<InputAdornment position="end">.json</InputAdornment>}
                                >
                                </Input>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.setState({ filenameDialog: false, saving: false })} color="primary">{T.translate('generic.cancel')}</Button>
                            <Button disabled={!this.props.selectedStory.filename} onClick={() => this.confirmFilename()} color="primary">{T.translate('generic.save')}</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        } else if (this.props.stories.length === 0) {
            return (
                <div className="story-creator">
                    <SimpleStoryList toggleRetract={() => this.setState({ retract: !this.state.retract })} stories={this.props.stories} editedStory={this.props.selectedStory} saving={this.state.saving} />
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
        selectedStory: state.story.story
    }
}

export default connect(mapStateToProps, { selectCurrentStory, displaySnackbar, displayConfirmDialog })(StoryCreator);