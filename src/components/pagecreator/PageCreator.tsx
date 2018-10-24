import * as React from 'react';
import './pagecreator.css';
import T from 'i18n-react';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, TextField, Button } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

interface Props {
    pages: Array<Page>
}

interface State {

}

class PageCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <div className="page-creator">
                {this.props.pages.map((page, i) => {
                    return (
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                <Typography>{T.translate('generic.page') + ' ' + (i + 1)}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <TextField
                                    id="cols-number"
                                    label={T.translate('interface.cols')}
                                    value={page.cols}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    id="rows-number"
                                    label={T.translate('interface.rows')}
                                    value={page.rows}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    variant="outlined"
                                    style={{ marginLeft: "10px" }}
                                />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                })}
                <Button variant="contained" color="primary" style={{marginTop:"10px"}}>{T.translate('generic.addpage')}</Button>
            </div>
        );
    }
}

export default PageCreator;