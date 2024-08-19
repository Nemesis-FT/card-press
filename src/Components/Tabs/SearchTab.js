import React, {useEffect, useState} from 'react';
import {useAppContext} from "../../libs/Context";
import Picker from "../Bricks/Picker";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Panel from "../Bricks/Panel";
import Filters from "./Filters";

export default function SearchTab() {
    const {config} = useAppContext()

    const [backend, setBackend] = useState(null);

    const [filters, setFilters] = useState([]);

    if (config.sources.length === 0) {
        return (<div>
            <p>No remote sources have been set. Please do so in the settings panel.</p>
        </div>)
    }

    return (
        <div>
            <Row>
                <Col>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2}>
                                Remote source?
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Select onChange={event => {
                                    let b = config.sources.find(elem => elem.id === event.target.value)
                                    setBackend(b)
                                }}>
                                    <option>Select one backend from the list.</option>
                                    {config.sources.map(elem => <option
                                        value={elem.id}>{elem.name} - {elem.url}</option>)}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>
                {backend !== null && <Col>
                    <Filters filters={filters} setFilters={setFilters}/>
                </Col>}
            </Row>
        </div>
    );
}