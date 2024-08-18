import Style from './App.css';
import Routes from './Routing'
import {AppContext} from './libs/Context'
import React, {useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import Navi from './Components/Navi';

function App() {
  const [config, setConfig] = useState(null)
  const [storage, setStorage] = useState(null)

  useEffect(() => {
    onLoad();
  }, []);

  async function getOrCreateConfig(){
    let conf = localStorage.getItem("config");
    if(conf === null){
      conf = JSON.stringify({
        sources: [

        ],
        applicationVersion: "0.1.1"
      });
      localStorage.setItem("config", conf);

    }
    let parsedConf = JSON.parse(conf)
    if(parsedConf.applicationVersion !== "0.1.1"){
      alert("This application was previously used in an older version. The conversion sorcerer will attempt to convert your stuff.")
      if(parsedConf.applicationVersion === "0.1"){
        parsedConf.applicationVersion = "0.1.1";
        parsedConf.enableJumbotron = true;
      }
      localStorage.setItem("config", JSON.stringify(parsedConf))
    }
    setConfig(parsedConf);
  }

  async function getOrCreateStorage(){
    let storage = localStorage.getItem('data');
    if(storage === null){
      storage = JSON.stringify({
        decks: [

        ],
        custom_content: [

        ]
      })
      localStorage.setItem("data", storage);
    }
    setStorage(JSON.parse(storage));
  }


  async function onLoad() {
    document.body.style.background = "#212529"
    document.body.style.color = "#fff"
    await getOrCreateConfig();
    await getOrCreateStorage();
  }

  if(config===null){
    return(<div>Loading...</div>)
  }

  return (
      <div>
        <AppContext.Provider value={{
          config, setConfig, storage, setStorage
        }}>
          <Navi/>
          <div className={Style.Container}>
            <Container data-bs-theme="dark">
              <Routes/>
            </Container>
          </div>
        </AppContext.Provider>
      </div>
  );
}

export default App;
