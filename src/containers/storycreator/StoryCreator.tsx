import * as React from 'react';
import './storycreator.css';
import T from 'i18n-react';
import { Story } from 'src/interfaces/Story';
import SimpleStoryList from 'src/components/simplestorylist/SimpleStoryList';
import PlayerInterfaces from 'src/components/playerinterfaces/PlayerInterfaces';
import ActionsTimeline from 'src/components/actionstimeline/ActionsTimeline';
import { Card, TextField, Button } from '@material-ui/core';
import { Role } from 'src/interfaces/Role';
import { Save } from '@material-ui/icons';

interface Props {
    stories: Array<Story>
    roles: Array<Role>
}

interface State {
    selectedStory: Story
}

class StoryCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedStory: props.stories[0]
        }
    }

    public handleChange(event: any, name: string) {
        let selectedStory = this.state.selectedStory;
        selectedStory[name] = event.target.value;

        if (name === "nbPlayers" && selectedStory.interfaces.length > event.target.value) {
            selectedStory.interfaces.length = event.target.value;
        }

        this.setState({
            selectedStory
        });
    }

    public selectStory(story: Story) {
        this.setState({ selectedStory: story });
    }

    public render() {
        return (
            <div className="story-creator">
                <SimpleStoryList stories={this.props.stories} select={(story: Story) => { this.selectStory(story) }} />
                <Card className="story-details">
                    <div style={{ display: "flex", alignItems: "center", flex:"1", marginRight:"20px" }}>
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
                            style={{ marginRight: "10px" }}
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
                        <Button style={{ marginRight: "10px" }} variant="outlined" color="primary" ><Save style={{ marginRight: "5px" }} /> {T.translate('generic.save')}</Button>
                    </div>
                </Card>
                <PlayerInterfaces story={this.state.selectedStory} roles={this.props.roles} />
                <ActionsTimeline actions={this.state.selectedStory.actions} />
            </div>
        );
    }
}

export default StoryCreator;