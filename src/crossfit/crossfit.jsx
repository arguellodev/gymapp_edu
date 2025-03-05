import { useState } from "react";
import './crossfit.css';
import WorkoutTimer from "./cronometro";
import Amrap from "./amrap";

const Crossfit =()=>{

    return(
        <>
        {/*
        <h1>Seccion de Crossfit</h1>
        <div className="crossfit-container">
            <div className="amrap-link">
                <p>AMRAP</p>
            </div>
            <div className="fortime-link">
                <p>For Time</p>
            </div>
            <div className="emom-link">
                <p>EMOM</p>
            </div>
            <div className="tabata-link">
                <p>Tabata</p>
            </div>

        </div> */}
        

     
        <Amrap></Amrap>
        </>
        
    )

}

export default Crossfit;

