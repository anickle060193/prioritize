import * as React from 'react';
import { Grid, Row } from 'react-bootstrap';

import './App.css';

import TaskQueue from 'components/TaskQueue';

export default class App extends React.Component
{
    render()
    {
        return (
            <Grid>
                <Row>
                    <TaskQueue />
                </Row>
            </Grid>
        );
    }
}
