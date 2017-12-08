import React from 'react';
import {
  Alert,
  Panel,
  Table,
} from 'react-bootstrap';

const ErrorPanel = ({ name, message, details }) => {
  if (process.env.NODE_ENV === 'development' && details) {
    return (
      <Alert bsStyle="danger">
        <h4>{name}</h4>
        <p>{message}</p>
        <p>
          <Panel header="Error Details">
            <Table striped bordered condensed>
              <thead>
                <tr><td>Prop</td><td>Value</td></tr>
              </thead>
              <tbody>
                <tr><td>name</td><td>{details.name}</td></tr>
                <tr><td>message</td><td>{details.message}</td></tr>
                <tr><td>stack</td><td><pre>{details.stack}</pre></td></tr>
              </tbody>
            </Table>
          </Panel>
        </p>
      </Alert>
    );
  }

  return (
    <Alert bsStyle="danger">
      <h4>{name}</h4>
      <p>{message}</p>
    </Alert>
  );
};

export default ErrorPanel;
