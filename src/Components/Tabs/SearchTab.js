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

export default function SearchTab() {
    const {config, storage} = useAppContext()

    const [backend, setBackend] = useState(null);

    const [filters, setFilters] = useState([]);

    const [data, setData] = useState([]);

    useEffect(() => {
        console.debug("Filters:" +filters)
        if(filters.length===0){
            return
        }
        retrieveSources().then(r => console.log("Done"));
    }, [filters]);

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

        // Run class filters
        let classes = filters.filter(elem => elem.type === "class").map(elem => elem.value)
        if(classes.length!==0){
            let tmp = await fetch(backend.url+"/data/generated/gendata-spell-source-lookup.json")
            let json = await tmp.json()
            let lookups = []
            for(let source of sources){
                if(source.value === "custom"){
                    // Find some way to add the custom bindings...
                    continue
                }
                if(json[source.value]===null){
                    console.error("Warning: undefined source in lookup! Skipping...")
                    continue
                }
                for(let key of Object.keys(json[source.value])){
                    let classList = []
                    for(let sourceClass of Object.keys(json[source.value][key]["class"])){
                        for(let cls of Object.keys(json[source.value][key]["class"][sourceClass])){
                            classList.push(cls)
                        }
                    }
                    lookups.push({name: key, value: classList})
                }
            }
            data = data.filter(spell => {
                // Find the spell in the lookup table
                let lookup = lookups.find(lookup => spell.name.toLowerCase()===lookup.name.toLowerCase())
                // Check if the class is in the class filters
                if(lookup===null){
                    return false
                }
                for(let cls of lookup.value){
                    if(classes.includes(cls)){
                        return true
                    }
                }
                return false
            })
        }
        setData(data)
    }

    if (config.sources.length === 0) {
        return (<Panel>
            <p>No remote sources have been set. Please do so in the settings panel.</p>
        </Panel>)
    }

    return (
        <div>
            <Row>
                <Col sm={8}>
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
                <Col sm={2}><Button variant={"light"} onClick={retrieveSources}> Search </Button>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Spell name</th>
                            <th>Level</th>
                            <th>School</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map(spell => (
                            <tr>
                                <td>{spell.name}</td>
                                <td>{spell.level}</td>
                                <td>{spell.school}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
                <Col sm={6}>

                </Col>
            </Row>
        </div>
    );
}