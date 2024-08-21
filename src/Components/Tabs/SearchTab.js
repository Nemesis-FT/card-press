import React, {useEffect, useState} from 'react';
import {useAppContext} from "../../libs/Context";
import Picker from "../Bricks/Picker";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Panel from "../Bricks/Panel";
import Filters from "./Filters";
import Button from "react-bootstrap/Button";
import Style from "./SearchTab.module.css"
import SpellDetails from "./SpellDetails";

export default function SearchTab() {
    const {config, storage} = useAppContext()

    const [backend, setBackend] = useState(null);

    const [filters, setFilters] = useState([]);

    const [data, setData] = useState([]);

    const [target, setTarget] = useState(null)

    const [selection, setSelection] = useState([])

    const levelLookup = {
        0: "Cantrip",
        1: "1st Level",
        2: "2nd Level",
        3: "3rd Level",
        4: "4th Level",
        5: "5th Level",
        6: "6th Level",
        7: "7th Level",
        8: "8th Level",
        9: "9th Level"
    }

    useEffect(() => {
        console.debug("Filters:" + filters)
        if (filters.length === 0) {
            return
        }
        retrieveSources().then(r => console.log("Done"));
    }, [filters]);

    async function getClassLookup(sources) {
        let tmp = await fetch(backend.url + "/data/generated/gendata-spell-source-lookup.json")
        let json = await tmp.json()
        let lookups = []
        for (let source of sources) {
            if (source.value === "custom") {
                // Find some way to add the custom bindings...
                continue
            }
            if (json[source.value] === null) {
                console.error("Warning: undefined source in lookup! Skipping...")
                continue
            }
            for (let key of Object.keys(json[source.value])) {
                let classList = []
                for (let sourceClass of Object.keys(json[source.value][key]["class"])) {
                    for (let cls of Object.keys(json[source.value][key]["class"][sourceClass])) {
                        classList.push(cls)
                    }
                }
                lookups.push({name: key, value: classList})
            }
        }
        return lookups
    }

    async function retrieveSources() {
        let sources = filters.filter(elem => elem.type === "source")
        if (backend === null) {
            sources = sources.filter(elem => elem.type === "source" && elem.value === "custom")
        }
        if (sources.length === 0) {
            alert("Backend has not been set and custom sources have not been selected.")
        }
        let data = [];
        for (let source of sources) {
            if (source.value === "custom") {
                data.push(...storage.custom_content)
                continue
            }
            console.log("Loading source " + source.value + " for " + backend.url)
            let tmp = await fetch(backend.url + "/data/spells/spells-" + source.value + ".json")
            if (tmp.status !== 200) {
                console.warn("Error while loading source " + source.value + " for " + backend.url)
                continue
            }
            let json = await tmp.json()
            data.push(...json.spell)
        }
        // Provide class data

        let lookups = await getClassLookup(sources)

        data = data.map(spell => {
            let lookup = lookups.find(lookup => spell.name.toLowerCase() === lookup.name.toLowerCase())
            return {...spell, classes: lookup.value}
        })

        // Run class filters
        let classes = filters.filter(elem => elem.type === "class").map(elem => elem.value)
        if (classes.length !== 0) {
            data = data.filter(spell => {
                // Find the spell in the lookup table
                for (let cls of spell.classes) {
                    if (classes.includes(cls)) {
                        return true
                    }
                }
                return false
            })
        }
        let levels = filters.filter(elem => elem.type === "level").map(elem => elem.value)
        if (levels.length !== 0) {
            data = data.filter(spell => levels.includes(levelLookup[spell.level]))
        }
        setData(data)
    }

    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function sortBy(field) {
        let tmp = [...data]
        console.debug("Sorting by " + field)
        tmp.sort(function (a, b) {
            let textA = a[field].toString().toUpperCase();
            let textB = b[field].toString().toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
        // it was already sorted!
        if (arraysEqual(tmp, data)) {
            tmp.sort(function (a, b) {
                let textA = a[field].toString().toUpperCase();
                let textB = b[field].toString().toUpperCase();
                return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
            })
        }
        setData(tmp)
    }

    if (config.sources.length === 0) {
        return (<Panel>
            <p>No remote sources have been set. Please do so in the settings panel.</p>
        </Panel>)
    }

    return (
        <div>
            <Row>
                <Col sm={10}>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Col>
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
                <Col sm={2}>
                    <Filters filters={filters} setFilters={setFilters}/>
                </Col>
            </Row>
            <Panel>
                <Row>
                    <Col sm={6}>
                        {data.length === 0 && <p>Please choose at least one filter.</p>}
                        {data.length !== 0 &&
                            <div className={Style.ScrollableLeft}>
                                <Table striped bordered hover>
                                    <thead className={Style.TableHead}>
                                    <tr>
                                        <th className={Style.TableHeadElement} onClick={event => {
                                            sortBy("name")
                                        }}>Spell name
                                        </th>
                                        <th className={Style.TableHeadElement} onClick={event => {
                                            sortBy("level")
                                        }}>Level
                                        </th>
                                        <th className={Style.TableHeadElement} onClick={event => {
                                            sortBy("school")
                                        }}>School
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody className={Style.Scrollable}>
                                    {data.map(spell => (
                                        <tr onClick={event => {
                                            setTarget(spell)
                                        }}>
                                            <td>{spell.name}</td>
                                            <td>{spell.level}</td>
                                            <td>{spell.school}</td>
                                        </tr>
                                    ))}
                                    </tbody>

                                </Table>
                            </div>}
                    </Col>
                    <Col sm={6}>
                        <div className={Style.ScrollableLeft}>
                            {target !== null &&
                                <SpellDetails item={target} setSelection={setSelection} selection={selection}/>}
                        </div>
                    </Col>
                </Row>
            </Panel>
        </div>
    );
}