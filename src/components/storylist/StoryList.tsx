import * as React from 'react';
import './storylist.css';
import { CardHeader, Paper, Table, TableHead, TableCell, TableRow, TableBody, Button } from '@material-ui/core';
import T from 'i18n-react';
import Story from 'src/interfaces/Story';

interface Props {
    stories: Array<Story>
    nbPlayers: number
    startStory: Function
}

interface State {

}

class StoryList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <Paper className="story-list">
                <CardHeader
                    title={T.translate('instructor.tabletitle')}
                    component="h2"
                />
                <div className="table-wrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{T.translate('story.name')}</TableCell>
                                <TableCell>{T.translate('story.description')}</TableCell>
                                <TableCell numeric>{T.translate('story.nbplayers')}</TableCell>
                                <TableCell>{T.translate('story.action')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.stories.map(story => {
                                return (
                                    <TableRow key={story.id}>
                                        <TableCell component="th" scope="row">
                                            {story.name}
                                        </TableCell>
                                        <TableCell>{story.description}</TableCell>
                                        <TableCell className={this.props.nbPlayers !== story.nbPlayers ? 'red' : 'green'} numeric>{this.props.nbPlayers} / {story.nbPlayers}</TableCell>
                                        <TableCell><Button onClick={() => this.props.startStory(story)} disabled={this.props.nbPlayers !== story.nbPlayers} color="primary">{T.translate('story.launch')}</Button></TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }
}

export default StoryList;