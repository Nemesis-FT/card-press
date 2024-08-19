import React, {useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Checker(props) {

    useEffect(() => {
        if(props.filters.find(elem => elem.type === props.filter.type && elem.value === props.filter.value)!==undefined) {
            setChecked(true)
        }
    }, [props.filter, props.filters])

    const [checked, setChecked] = useState(false);

    return (
        <Form.Check type="switch" inline label={props.filter.value} checked={checked} onChange={event => {
            setChecked(!checked);
            if (!checked) {
                let filters = [...props.filters]
                filters.push(props.filter)
                props.setFilters(filters)
            } else {
                let filters = [...props.filters]
                let tmp = filters.filter(elem => !(elem.value === props.filter.value && elem.type === props.filter.type));
                props.setFilters(tmp)
            }
        }}/>
    );
}