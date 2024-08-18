import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Jumbotron from "./Bricks/Jumbotron";
import LandingTabs from "./LandingTabs";
import {useAppContext} from "../libs/Context";

export default function Landing() {
    const {config} = useAppContext()
    let randomMotds = [
        "I hope you enjoy your stay!",
        "Roll initiative.",
        "Get your printer ready!",
        "I didn't know what to put here, so get some random messages. The jumbotron looked lonely."
    ]
    return (
        <div>
            {config.enableJumbotron &&
            <Jumbotron title={"Welcome on CardPress, adventurer."}>
                <p>{randomMotds.at(Math.floor(Math.random()*randomMotds.length))}</p>
            </Jumbotron>}
            {config.enableJumbotron===false && <br/>}
            <LandingTabs/>
        </div>

    );
}