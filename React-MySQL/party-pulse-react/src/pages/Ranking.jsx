import React, { useState, useEffect } from 'react';
import { useRanking } from '../hooks/useRanking';

const Ranking = () => {
    const { ranking: rankings, loading, error, fetchRanking } = useRanking();

    useEffect(() => {
        fetchRanking();
    }, [fetchRanking]);

    return (
        <section id="ranking" className="page active">
            <div className="container">
                <div className="ranking-card">
                    <h2 style={{ color: '#bc13fe' }}><i className="fas fa-crown"></i> Party Legendák</h2>
                    <p>Top felhasználók az aktivitásuk alapján.</p>

                    {loading ? (
                        <p style={{ textAlign: 'center' }}>
                            <i className="fas fa-spinner fa-spin"></i> Ranglista betöltése...
                        </p>
                    ) : error ? (
                        <p style={{ textAlign: 'center', color: '#ff4444' }}>{error}</p>
                    ) : (
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
                                {rankings.map((user) => (
                                    <tr key={user.rank}>
                                        <td>{user.rank}.</td>
                                        <td>{user.rank === 1 ? <strong>{user.username}</strong> : user.username}</td>
                                        <td>{user.events}</td>
                                        <td>{user.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Ranking;
