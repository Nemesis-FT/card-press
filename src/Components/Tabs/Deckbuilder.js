import React, {useState} from 'react';
import Button from "react-bootstrap/Button";
import SearchTab from "./SearchTab";
import Style from "./SearchTab.module.css";
import Table from "react-bootstrap/Table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import Panel from "../Bricks/Panel";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import {useAppContext} from "../../libs/Context";

export default function DeckBuilder(props) {

    const [selected, setSelected] = useState(null);

    const [list, setList] = useState(props.deck.contents)

    const [show, setShow] = useState(false)

    const [deckName, setDeckName] = useState(props.deck.name)

    const {storage, setStorage} = useAppContext()

    function addSpell(){
        console.debug(list)
        if(list.find(elem=>
            elem.name === selected.name && elem.source === selected.source
        )){
            return;
        }
        setList([...list, selected])
    }

    function removeSpell(spell){
        let res = list.filter(elem => elem.name !== spell.name && elem.source !== spell.source)
        setList(res)
    }

    function saveDeck(){
        let deck = {...props.deck, contents:list, name:deckName, lastEdit:new Date()}
        let otherDecks = storage.decks.filter(elem=>elem.id!==deck.id)
        setStorage({...storage, decks:[...otherDecks, deck]})
        localStorage.setItem("data", JSON.stringify({...storage, decks:[...otherDecks, deck]}))
        alert("Changes have been saved successfully!")
    }

    return (
        <div>
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                        Name
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="MyBackend" value={deckName}
                                      onChange={event => {
                                          setDeckName(event.target.value)
                                      }}/>
                    </Col>
                </Form.Group>
            </Form>
            <div>
                {list.length === 0 && <Panel>The deck is empty!</Panel>}
                {list.length !== 0 && <div className={Style.ScrollableLeft}>
                    <Table striped bordered hover>
                        <thead className={Style.TableHead}>
                        <tr>
                            <th className={Style.TableHeadElement}>Name
                            </th>
                            <th className={Style.TableHeadElement}>Source
                            </th>
                            <th className={Style.TableHeadElement}>Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody className={Style.Scrollable}>
                        {list.map(item => (
                            <tr>
                                <td>{item.name}</td>
                                <td>{item.source}</td>
                                <td>
                                    <FontAwesomeIcon icon={faTrash} onClick={(event => {
                                        removeSpell(item)
                                    })}/></td>
                            </tr>
                        ))}
                        </tbody>

                    </Table>
                </div>}
            </div>
            {show===true && <SearchTab setSelected={setSelected}/>}
            <Row style={{"marginBottom": "10px"}}>
                <Col><Button variant={"light"} onClick={event => {setShow(!show)}}>Toggle spell importer</Button></Col>
                <Col>{selected !== null && <Button variant={"light"} onClick={addSpell}>Add selected</Button>}</Col>
            </Row>
            <Button variant={"light"} onClick={saveDeck}>Save changes</Button>
        </div>
    );
}