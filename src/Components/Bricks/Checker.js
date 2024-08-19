import React, {useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Checker(props) {

    useEffect(() => {
        if(props.filters.find(elem => elem.type === props.filter.type && elem.value === props.filter.value)!==undefined) {
            setChecked(true)
        }
    }, [props.filter])

    const [checked, setChecked] = useState(false);

    return (
        <Form.Check type="switch" inline label={props.filter.value} checked={checked} onChange={event => {
            setChecked(!checked);
            if (!checked) {
                props.filters.push(props.filter)
                props.setFilters(props.filters)
            } else {
                let tmp = props.filters.filter(elem => elem.value !== props.filter.value && elem.type!==props.filter.type);
                props.setFilters(tmp)
            }
            console.log(props.filters);
        }}/>
    );
}