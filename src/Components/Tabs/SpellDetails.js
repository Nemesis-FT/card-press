import React, {useEffect, useState} from 'react';
import Panel from "../Bricks/Panel";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function SpellDetails(props) {

    const [item, setItem] = useState(null);
    function setup() {
        setItem({...props.item});
    }

    useEffect(() => {
        setup()
    }, [props])

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

    const schoolLookup = {
        "C": "Conjuration",
        "E": "Enchantment",
        "N": "Necromancy",
        "V": "Evocation",
        "I": "Illusion",
        "A": "Abjuration",
        "T": "Transmutation",
        "D": "Divination"
    }

    function add() {
        let selection = [...props.selection]
        if (selection.find(elem => elem.name === props.item.name && elem.source === props.item.source))
            selection.push(props.item)
        props.setSelection(selection)
    }

    function contentPrettify(content) {
        try {
            if (typeof content !== "string") {
                if (content.type === "entry" || content.type === "entries") {
                    let tmp = ""
                    content.entries.forEach(elem => {
                        tmp += elem
                    })
                    content = content.name + ": " + tmp;
                } else if (content.type === "list") {
                    let tmp = ""
                    content.items.forEach(elem => {
                        tmp += elem + "; "
                    })
                    content = tmp;
                } else if (content.type === "table") {
                    content = "For further information, please look at the related table."
                } else {
                    throw new Error()
                }
            }
        } catch (e) {
            console.debug(e)
            console.debug(content)
            return "Error while parsing."
        }
        let toRemove = ["{", "}", /\@.*?\s/g, /\|.*?(?=\ )/g, /rating=\[.*?\]/g, "@filter"]
        try {
            for (let string of toRemove) {
                content = content.replaceAll(string, " ")
            }
        } catch (e) {
            return content
        }
        return content
    }

    function castingPrettify(data) {
        let result = ""
        if (data.time === null || data.time.length === 0) {
            return result
        }
        for (let item of data.time) {
            if (item.number !== undefined) {
                result += item.number + " "
            }
            if (item.unit !== undefined) {
                result += item.unit + " "
            }
            result += ","
        }
        return result.slice(0, result.length - 1)
    }

    function durationPrettify(data) {
        let result = ""
        if (data === null || data === undefined || data.length === 0) {
            return result
        }
        for (let item of data) {
            if (item.type !== undefined) {
                result += item.type + " "
            }
            if (item.duration !== null && item.duration !== undefined) {
                if (item.duration.amount !== undefined) {
                    result += item.duration.amount + " "
                }
                if (item.duration.type !== undefined) {
                    result += item.duration.type + "(s) "
                }
            }
            if (item.concentration === true) {
                result += "C"
            }
            result += ","
        }
        return result.slice(0, result.length - 1)
    }

    function componentsPrettify(data) {
        if (data === null) {
            return ""
        }
        let tmp = ""
        if (data["v"] === true) {
            tmp += "V; "
        }
        if (data["s"] === true) {
            tmp += "S; "
        }
        if (data["m"] !== undefined) {
            if (typeof data["m"] === "string") {
                tmp += data["m"]
            } else {
                tmp += data["m"].text
            }
        }
        return tmp
    }

    function rangePrettify(data) {
        let tmp = ""
        if (data.type !== null) {
            tmp += data.type + " "
        }
        if (data.distance !== null && data.distance !== undefined) {
            if (data.distance.amount !== undefined) {
                tmp += data.distance.amount + " "
            }
            if (data.distance.type !== undefined) {
                tmp += data.distance.type + " "
            }
        }
        return tmp
    }

    if (item === null) {
        return (<p>Setting up...</p>)
    }

    return (
        <div>
            <Panel style={{"marginTop": "0px"}}>
                <h3>
                    {item.name}
                </h3>
                <p><i>{item.source}, page {item.page} - {levelLookup[item.level]} {schoolLookup[item.school]}</i></p>
                <p style={{"marginBottom": "0px"}}><b>Casting
                    time: </b>{(item.time !== undefined) ? castingPrettify(item) : "No casting time"}</p>
                <p style={{"marginBottom": "0px"}}>
                    <b>Range: {(item.range !== undefined) ? rangePrettify(item.range) : "No range time"}</b></p>
                <p style={{"marginBottom": "0px"}}>
                    <b>Components: {(item.components !== undefined) ? componentsPrettify(item.components) : "No components"}</b>
                </p>
                <p style={{"marginBottom": "0px"}}>
                    <b>Duration: {(item.duration !== undefined) ? durationPrettify(item.duration) : "No duration"}</b>
                </p>
                <hr/>
                {Array.isArray(item.entries) && props.item.entries.map(stuff => <p>{contentPrettify(stuff)}</p>)}
                {!Array.isArray(item.entries) && <p>{contentPrettify(item.entries)}</p>}
            </Panel>
        </div>
    );
}