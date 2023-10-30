import React from "react";
import WindalsNav from "../navbar";
import './supervisor.css'
import Footer from "../footer";
function Supervisor() {
    return (
        <>
            <div>
                <WindalsNav />
                <div className="superv">
                    <h1>Supervisor Dashboard</h1>
                    <div className="svdash">
                        <div className="leftmenu">
                            <div className="leftmenuinner">
                                <h2>Stations</h2>

                                <a href="">Station 1</a>
                                <a href="">Station 2</a>
                                <a href="">Station 3</a>
                                <a href="">Station 4</a>
                                <a href="">Station 5</a>
                                <a href="">Station 6</a>
                                <a href="">Station 7</a>
                                <a href="">Station 8</a>
                                <a href="">Station 9</a>
                                <a href="">Station 10</a>
                                <a href="">Station 11</a>
                                <a href="">Station 12</a>
                                <a href="">Station 13</a>
                                <a href="">Station 14</a>
                                <a href="">Station 15</a>
                                <a href="">Station 16</a>

                                <br />
                            </div>

                        </div>
                        <div className="rightmenu" style={{ marginLeft: '22vw' }}>
                            right menu
                        </div>

                    </div>




                </div>
                <Footer />
            </div>

        </>
    )
}

export default Supervisor;