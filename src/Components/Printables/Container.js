import { useState } from 'react';
import LandingTabs from "../LandingTabs";
import Spell from "./Spell";

// props.list contiene tutti gli oggetti con i dati delle spell
// props.config contiene tutti i dati sul formato
function Container(props) {
    if(props.deck === null){
        return <div></div>;
    }
    return (
        <div style={{maxWidth: '29,7cm', display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
            {props.deck.contents.map((item, index) => (<Spell spell={item}></Spell>))}
        </div>
    );
}

export default Container;