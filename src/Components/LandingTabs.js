import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SettingsTab from "./Tabs/SettingsTab";
import SearchTab from "./Tabs/SearchTab";

function LandingTabs() {
    const [key, setKey] = useState('spells');

    return (
        <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3" fill
        >
            <Tab eventKey="data" title="Your content">
                This is the content tab.
            </Tab>
            <Tab eventKey="spells" title="Spell list">
                <SearchTab/>
            </Tab>
            <Tab eventKey="settings" title="Your settings">
                <SettingsTab/>
            </Tab>
        </Tabs>
    );
}

export default LandingTabs;