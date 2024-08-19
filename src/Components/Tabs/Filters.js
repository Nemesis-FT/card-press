import React, {useEffect, useState} from 'react';
import {useAppContext} from "../../libs/Context";
import Panel from "../Bricks/Panel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Checker from "../Bricks/Checker";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function Filters(props) {
    const {config} = useAppContext()

    const [filters, setFilters] = useState(props.filters)

    const sourcesList = ["aag", "ai", "bmt", "ftd", "ggr", "idrotf", "phb", "sato", "scc", "tce", "xge", "custom"]

    const classList = ["Artificier", "Bard", "Cleric", "Druid", "Monk", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard"]

    const levelList = ["Cantrip", "1st Level", "2nd Level", "3rd Level", "4th Level", "5th Level", "6th Level", "7th Level", "8th Level", "9th Level"]

    const [show, setShow] = useState(false)

    useEffect(() => {
        console.debug("Filters (INNER):" +filters)
        props.setFilters(filters)
    }, [filters])

    return (
        <div>
            <Button variant={"light"}  onClick={() => {setShow(true)}}>Filters</Button>
            <Modal show={show} onHide={(event) => {setShow(false)}} style={{"--bs-modal-header-border-color": "#41454c", "--bs-modal-footer-border-color": "#41454c"}} >
                <div style={{"backgroundColor":"#212529", "borderRadius": "5px"}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Filtering</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <h4>Sources</h4>
                                {sourcesList.map(elem =>
                                    <Checker key={elem} filter={{type: "source", value: elem}} setFilters={setFilters}
                                             filters={filters}/>)}
                            </Col>
                            <Col>
                                <h4>Classes</h4>
                                {classList.map(elem =>
                                    <Checker key={elem} filter={{type: "class", value: elem}} setFilters={setFilters}
                                             filters={filters}/>)}
                            </Col>
                            <Col>
                                <h4>Levels</h4>
                                {levelList.map(elem =>
                                    <Checker key={elem} filter={{type: "level", value: elem}} setFilters={setFilters}
                                             filters={filters}/>)}
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={(event) => {setShow(false)}}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

        </div>
    );
}