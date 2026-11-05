
const transportData = [
  // Direct transport
  {
    id: 1,
    from: "Tirunelveli",
    to: "Madurai",
    type: "Bus",
    startTime: "18:00",
    endTime: "22:00",
    fare: 150,
  },
  {
    id: 2,
    from: "Tirunelveli",
    to: "Madurai",
    type: "Taxi",
    startTime: "20:00",
    endTime: "23:00",
    fare: 1200,
  },
  {
    id: 3,
    from: "Tirunelveli",
    to: "Chennai",
    type: "Train",
    startTime: "21:00",
    endTime: "06:00",
    fare: 350,
  },

  // Alternative connecting transport
  {
    id: 4,
    from: "Tirunelveli",
    to: "Kovilpatti",
    type: "Bus",
    startTime: "23:00",
    endTime: "00:00",
    fare: 60,
  },
  {
    id: 5,
    from: "Kovilpatti",
    to: "Madurai",
    type: "Bus",
    startTime: "00:30",
    endTime: "02:00",
    fare: 100,
  },
  {
    id: 6,
    from: "Tirunelveli",
    to: "Kovilpatti",
    type: "Taxi",
    startTime: "22:30",
    endTime: "23:30",
    fare: 500,
  },
];

export default transportData;
