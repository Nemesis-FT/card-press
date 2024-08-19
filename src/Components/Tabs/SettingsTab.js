import {useAppContext} from "../../libs/Context";
import Panel from "../Bricks/Panel";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

export default function SettingsTab() {

    const {config, setConfig} = useAppContext()

    const [sourceAddShow, setSourceAddShow] = useState(false)

    const [newBackendUrl, setNewBackendUrl] = useState("")
    const [newBackendName, setNewBackendName] = useState("")

    const [showJumbotron, setShowJumbotron] = useState(config.enableJumbotron)

    const [reload, setReload] = useState(false);

    function updateConfig(config){
        localStorage.setItem("config", JSON.stringify(config))
    }

    async function addBackend(){
        if(newBackendName===""||newBackendUrl===""){
            alert("Both properties must be provided.")
            return
        }
        let response = await fetch(newBackendUrl)
        if(response.status!==200){
            alert("Backend is not responding. It will not get added.")
            return
        }

        config.sources.push({name: newBackendName, url: newBackendUrl, id: crypto.randomUUID()})
        setConfig(config);
        updateConfig(config);
        setSourceAddShow(false)
    }

    function deleteBackend(id){
        config.sources = config.sources.filter(elem => elem.id !== id)
        setConfig(config);
        updateConfig(config);
        alert("Successfully deleted!")
        setReload(true)
        setTimeout(()=>{setReload(false)}, 100);
    }

    if(config===null || reload){
        return (<p>Loading...</p>)
    }

    return (
        <div>
            <Panel>
                <h3>Remote sources</h3>
                {config.sources.length===0 &&
                <p>
                    No remote sources have been set!
                </p>
                }
                {config.sources.length>0 &&
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Url</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                {config.sources.map(source => (
                    <tr>
                        <td>{source.name}</td>
                        <td>{source.url}</td>
                        <td><FontAwesomeIcon icon={faTrash} onClick={(event => {deleteBackend(source.id)})}/></td>
                    </tr>
                ))}
                    </tbody>
                </Table>
                }
                <Button variant="light" onClick={(event) => {setSourceAddShow(true)}}>Add a source</Button>

                <Modal show={sourceAddShow} onHide={(event) => {setSourceAddShow(false)}} style={{"--bs-modal-header-border-color": "#41454c", "--bs-modal-footer-border-color": "#41454c"}} >
                    <div style={{"backgroundColor":"#212529", "borderRadius": "5px"}}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add a new source</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Please provide a valid remote backend url.</p>
                            <Form>
                                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                                    <Form.Label column sm={2}>
                                        Name
                                    </Form.Label>
                                    <Col sm={10}>
                                        <Form.Control type="text" placeholder="MyBackend" value={newBackendName}
                                                      onChange={event => {
                                                          setNewBackendName(event.target.value)
                                                      }}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                                    <Form.Label column sm={2}>
                                        Base Url
                                    </Form.Label>
                                    <Col sm={10}>
                                        <Form.Control type="text" placeholder="http://site.com" value={newBackendUrl}
                                                      onChange={event => {
                                                          setNewBackendUrl(event.target.value)
                                                      }}/>
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={(event) => {setSourceAddShow(false)}}>
                                Close
                            </Button>
                            <Button variant="light" onClick={addBackend}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>

            </Panel>
            <Panel>
                <h3>Application</h3>
                <Form>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>
                            Show jumbotron?
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Check type="checkbox" checked={showJumbotron} onChange={event => {
                                config.enableJumbotron = !showJumbotron
                                setConfig(config)
                                setShowJumbotron(!showJumbotron)
                                updateConfig(config)
                            }}/>
                        </Col>
                    </Form.Group>
                </Form>
            </Panel>
        </div>
    );
}