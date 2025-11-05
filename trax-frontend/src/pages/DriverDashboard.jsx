import { useEffect, useState } from "react";
import API from "../api.js";


const socket = io("http://localhost:3000", {
    auth: { token: localStorage.getItem('token') },
});


export default function DriverDashboard(){}