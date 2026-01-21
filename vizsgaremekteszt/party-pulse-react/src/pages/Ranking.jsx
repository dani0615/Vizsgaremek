import React from 'react';

const Ranking = () => {
    return (
        <section id="ranking" className="page active">
            <div className="container">
                <div className="ranking-card">
                    <h2 style={{ color: '#bc13fe' }}><i className="fas fa-crown"></i> Party Legendák</h2>
                    <p>Top felhasználók az aktivitásuk alapján.</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Helyezés</th>
                                <th>Felhasználó</th>
                                <th>Bulik</th>
                                <th>Pontszám</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>1.</td><td><strong>BorsodiBetyár</strong></td><td>14</td><td>2800</td></tr>
                            <tr><td>2.</td><td>TechnoKirálynő</td><td>11</td><td>2100</td></tr>
                            <tr><td>3.</td><td>AvasiSrác</td><td>9</td><td>1600</td></tr>
                            <tr><td>4.</td><td>ZemplénVibes</td><td>7</td><td>1200</td></tr>
                            <tr><td>5.</td><td>NightOwl_Ózd</td><td>6</td><td>1000</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Ranking;