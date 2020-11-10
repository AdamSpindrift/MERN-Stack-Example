import React from 'react';
import {getHours} from "date-fns";

function WelcomeMessage() {

    const date = new Date();
    const localHour = date.getHours();
    let welcome = "Hello";


    if (localHour >= 4 && localHour <= 12) {
        welcome = "Good Morning";
    } else if (localHour > 12 && localHour <= 18) {
        welcome = "Good Afternoon";
    } else if (localHour > 18 && localHour <= 21) {
        welcome = "Good Evening";
    } else if (localHour > 21 && localHour <= 23) {
        welcome = "It's late, grab a beer!";
    } else if (localHour >= 0 && localHour <= 2) {
        welcome = "It's late, grab a beer!";
    } else if (localHour === 3) {
        welcome = "Time for Bed";
    };


    return (
      <h1>{welcome}</h1>
    );
  }
  
  export default WelcomeMessage;