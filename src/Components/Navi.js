import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {useAppContext} from "../libs/Context";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNetworkWired, faUser } from '@fortawesome/free-solid-svg-icons'

function Navi() {
    return (
        <Navbar className="bg-body-tertiary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand>CardPress</Navbar.Brand>
                <Navbar.Toggle/>
            </Container>
        </Navbar>
    );
}

export default Navi;