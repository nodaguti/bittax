import React from 'react';
import {
  Navbar,
  Button,
  Glyphicon,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

const tooltip = (
  <Tooltip>各取引所の取引データを追加</Tooltip>
);

const Header = () => (
  <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <Link href="/" to="/">Bittax</Link>
      </Navbar.Brand>
    </Navbar.Header>
    <Navbar.Collapse>
      <Navbar.Form pullRight>
        <OverlayTrigger placement="bottom" overlay={tooltip}>
          <LinkContainer to="/source/add" activeClassName="">
            <Button bsStyle="primary">
              <Glyphicon glyph="plus" />
            </Button>
          </LinkContainer>
        </OverlayTrigger>
      </Navbar.Form>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
