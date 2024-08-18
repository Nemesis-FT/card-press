import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function DashboardTabs() {
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
                This is the spells search tab
            </Tab>
            <Tab eventKey="settings" title="Your settings">
                This is the settings tab
            </Tab>
        </Tabs>
    );
}

export default DashboardTabs;