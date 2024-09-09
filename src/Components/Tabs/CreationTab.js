import React, {useEffect, useState} from 'react';
import {useAppContext} from "../../libs/Context";
import Panel from "../Bricks/Panel";
import Style from "./SearchTab.module.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import {faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import SearchTab from "./SearchTab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DeckBuilder from "./Deckbuilder";
import Container from "../Printables/Container";

export default function CreationTab() {

    const [targetDeck, setTargetDeck] = useState(null)
    const [show, setShow] = useState(false)
    const {storage, setStorage} = useAppContext()

    function addDeck() {
        let decks = [...storage.decks, {
            name: "Untitled Deck",
            lastEdit: new Date(),
            contents: [],
            id: crypto.randomUUID()
        }];
        setStorage({...storage, decks: decks});
        localStorage.setItem("data", JSON.stringify({...storage, decks: decks}));
    }

    function removeDeck(id) {
        let result = window.confirm("You sure? This action cannot be undone.")
        if (!result) {
            return;
        }
        let decks = storage.decks.filter(deck => deck.id !== id);
        setStorage({...storage, decks: decks})
        localStorage.setItem("data", JSON.stringify({...storage, decks: decks}));
    }

    function editDeck(id) {
        let item = storage.decks.find(deck => deck.id === id);
        if (item === null) {
            alert("Deck not found!")
            return;
        }
        setTargetDeck(item);
        setShow(true)
    }

    if (storage === undefined || storage === null) {
        return (<div>Now loading...</div>)
    }
    return (
        <div>
            <Panel>
                <h3>Your decks <a href={"#"} onClick={addDeck} style={{"color":"white"}}>+</a></h3>
                <div>
                    {storage.decks === undefined || storage.decks.length === 0 &&
                        <p>No decks have been created yet!</p>}
                    {storage.decks !== undefined && storage.decks.length !== 0 && <div className={Style.ScrollableLeft}>
                        <Table striped bordered hover>
                            <thead className={Style.TableHead}>
                            <tr>
                                <th className={Style.TableHeadElement}>Name
                                </th>
                                <th className={Style.TableHeadElement}>Updated
                                </th>
                                <th className={Style.TableHeadElement}>Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody className={Style.Scrollable}>
                            {storage.decks.map(deck => (
                                <tr>
                                    <td>{deck.name}</td>
                                    <td>{deck.lastUpdate}</td>
                                    <td><FontAwesomeIcon style={{"marginRight": "10px"}} icon={faPencil}
                                                         onClick={(event => {
                                                             editDeck(deck.id)
                                                         })}/>
                                        <FontAwesomeIcon icon={faTrash} onClick={(event => {
                                            removeDeck(deck.id)
                                        })}/></td>
                                </tr>
                            ))}
                            </tbody>

                        </Table>
                    </div>}
                </div>
            </Panel>
            <Modal show={show} onHide={() => setShow(false)}
                   style={{"--bs-modal-header-border-color": "#41454c", "--bs-modal-footer-border-color": "#41454c"}}
                   keyboard={false} backdrop="static" size={"xl"}>
                <div style={{"backgroundColor": "#212529", "borderRadius": "5px", "color": "white"}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Deckbuilder</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DeckBuilder deck={targetDeck}/>
                    </Modal.Body>
                </div>
            </Modal>
            <Container deck={targetDeck}/>

        </div>
    );
}