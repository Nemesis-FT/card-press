import React, {useEffect, useState} from 'react';
import {useAppContext} from "../../libs/Context";
import Panel from "../Bricks/Panel";
import Style from "./SearchTab.module.css";
import Table from "react-bootstrap/Table";

export default function CreationTab() {
    const {storage} = useAppContext()

    return (
        <div>
            <h3>Your decks</h3>
            <Panel>
                {storage.decks.length === 0 && <p>No decks have been created yet!</p>}
                {storage.decks.length !== 0 && <div className={Style.ScrollableLeft}>
                    <Table striped bordered hover>
                        <thead className={Style.TableHead}>
                        <tr>
                            <th className={Style.TableHeadElement}>Name
                            </th>
                            <th className={Style.TableHeadElement}>Updated
                            </th>
                            <th className={Style.TableHeadElement}>Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody className={Style.Scrollable}>
                        {storage.decks.map(deck => (
                            <tr>
                                <td>{deck.name}</td>
                                <td>{deck.lastUpdate}</td>
                                <td></td>
                            </tr>
                        ))}
                        </tbody>

                    </Table>
                </div>}
            </Panel>
        </div>
    );
}