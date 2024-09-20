
import './Data_Button.css';
import axios from 'axios';
import React, {useState} from "react";

export default function Data_Button() {
    const [users, setUsers] = useState([]);
    const fetchData = () => {
        axios.get('http://localhost:5050/getUsers')
            .then(response => {
                console.log(response.data);
                setUsers(response.data);
            })
            .catch(err => console.log(err));
    };
    return (
        <div>
            <div className="button-container">
                <button onClick={fetchData}>Display Data</button>
            </div>
            {/* Table container positioned to the right of the button */}
            <div className="table-container">
                {users.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.password}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}