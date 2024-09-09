import Panel from "../Bricks/Panel";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React, {useState} from "react";

export default function Spell(props) {
    // Una business card ha dimensioni 8.9*5.1

    const levelLookup = {
        0:"Cantrip",
        1:"1st Level",
        2:"2nd Level",
        3:"3rd Level",
        4:"4th Level",
        5:"5th Level",
        6:"6th Level",
        7:"7th Level",
        8:"8th Level",
        9:"9th Level"
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

    const [duration, setDuration] = useState((props.spell.duration !== undefined) ? durationPrettify(props.spell.duration) :  "")
    const [range, setRange] = useState((props.spell.range !== undefined) ? rangePrettify(props.spell.range) : "")
    const [components, setComponents] = useState((props.spell.components !== undefined) ? componentsPrettify(props.spell.components):"")
    const [cTime, setCTime] = useState((props.spell.time !== undefined) ? castingPrettify(props.spell) : "")

    function contentPrettify(content){
        try{
            if(typeof content !== "string"){
                if(content.type==="entry" || content.type==="entries"){
                    let tmp = ""
                    content.entries.forEach(elem => {tmp+=elem})
                    content = content.name+": "+tmp;
                }
                else if(content.type==="list"){
                    let tmp = ""
                    content.items.forEach(elem => {tmp+=elem+"; "})
                    content = tmp;
                }
                else if(content.type==="table"){
                    content = "For further information, please look at the related table."
                }
                else{
                    throw new Error()
                }
            }
        } catch (e) {
            console.debug(e)
            console.debug(content)
            return "Error while parsing."
        }
        let toRemove = ["{", "}", /\@.*?\s/g, /\|.*?(?=\ )/g, /rating=\[.*?\]/g, "@filter"]
        try{
            for (let string of toRemove){
                content = content.replaceAll(string, " ")
            }
        } catch (e) {
            return content
        }
        return content
    }

    function castingPrettify(data){
        let result = ""
        if(data.time===null || data.time.length===0){
            return result
        }
        for(let item of data.time){
            if(item.number!==undefined){
                result += item.number + " "
            }
            if(item.unit!==undefined){
                result += item.unit + " "
            }
            result += ","
        }
        return result.slice(0,result.length-1)
    }

    function durationPrettify(data){
        let result = ""
        if(data===null || data===undefined || data.length===0){
            return result
        }
        for(let item of data){
            if(item.type!==undefined){
                result += item.type + " "
            }
            if(item.duration!==null && item.duration!==undefined){
                if(item.duration.amount!==undefined){
                    result += item.duration.amount + " "
                }
                if(item.duration.type!==undefined){
                    result += item.duration.type + "(s) "
                }
            }
            if(item.concentration===true){
                result += "C"
            }
            result += ","
        }
        return result.slice(0,result.length-1)
    }

    function componentsPrettify (data){
        if(data === null){
            return ""
        }
        let tmp = ""
        if(data["v"]===true){
            tmp+= "V; "
        }
        if(data["s"]===true){
            tmp+= "S; "
        }
        if(data["m"]!==undefined){
            if(typeof data["m"] === "string"){
                tmp+=data["m"]
            }else{
                tmp+=data["m"].text
            }
        }
        return tmp
    }

    function rangePrettify(data){
        let tmp = ""
        if(data.type!==null){
            tmp += data.type + " "
        }
        if(data.distance!==null && data.distance!==undefined){
            if(data.distance.amount!==undefined){
                tmp += data.distance.amount + " "
            }
            if(data.distance.type!==undefined){
                tmp += data.distance.type + " "
            }
        }
        return tmp
    }

    return (
        <Panel style={{
            maxHeight: "8.9cm",
            maxWidth: "5.1cm",
            minHeight: "8.9cm",
            minWidth: "5.1cm",
            padding: "0px",
            fontSize: "14px"
        }}>
            <Panel style={{padding: "1px"}}>
                <center>
                    {props.spell.name}
                </center>
            </Panel>
            <Row style={{margin: "0px"}}>
                <Col style={{padding: "0px"}}>
                    <Panel style={{padding: "1px", marginTop: "2px"}}>
                        <center>
                            {cTime}
                        </center>
                    </Panel>
                </Col>
                <Col style={{padding: "0px"}}>
                    <Panel style={{padding: "1px", marginTop: "2px"}}>
                        <center>
                            {range}
                        </center>
                    </Panel>
                </Col>
            </Row>
            <Row style={{margin: "0px"}}>
                <Col style={{padding: "0px"}}>
                    <Panel style={{padding: "1px", marginTop: "2px"}}>
                        <center>
                            {components}
                        </center>
                    </Panel>
                </Col>
                <Col style={{padding: "0px"}}>
                    <Panel style={{padding: "1px", marginTop: "2px"}}>
                        <center>
                            {duration}
                        </center>
                    </Panel>
                </Col>
            </Row>
            <Panel style={{padding: "3px", marginTop: "4px"}}>
                {Array.isArray(props.spell.entries) && props.spell.entries.map(stuff => <>{contentPrettify(stuff)}</>)}
                {!Array.isArray(props.spell.entries) && <>{contentPrettify(props.spell.entries)}</>}
            </Panel>
        </Panel>
    )
}

