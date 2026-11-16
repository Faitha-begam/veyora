// ---------------------------------------------------------------------------
// Veyora transport data  (SAMPLE DATA - for development and demonstration)
//
// Every record in this file is sample data. None of it comes from a live
// service, so it must NEVER be shown to a user as real-time availability.
//
// Fields:
//   id        - unique number for every record (used as the React key)
//   from/to   - location names
//   name      - a plain descriptive name shown on the cards (not a real operator)
//   type      - "Bus", "Train", "Taxi", "Car" or "Share Auto"
//   startTime - DEPARTURE time ("HH:MM", 24-hour)
//   endTime   - ARRIVAL time   ("HH:MM", 24-hour)
//               If endTime is earlier than startTime, the vehicle arrives
//               on the next day (for example 21:00 -> 06:00).
//   fare      - fare in rupees
//   dataSource - always "sample" in this file
//
// Extra field ONLY for on-demand vehicles (Taxi, Car, Share Auto):
//   reliableAvailability - true  = the sample data has a trusted route and
//                                  availability entry, so it may be suggested
//                          false = not trusted, so the app will NOT suggest it
// ---------------------------------------------------------------------------

const transportData = [
  // ----- Direct transport -----
  {
    id: 1,
    name: "Tirunelveli–Madurai Night Bus",
    from: "Tirunelveli",
    to: "Madurai",
    type: "Bus",
    startTime: "18:00",
    endTime: "22:00",
    fare: 150,
    dataSource: "sample",
  },
  {
    id: 2,
    name: "Tirunelveli–Madurai Taxi",
    from: "Tirunelveli",
    to: "Madurai",
    type: "Taxi",
    startTime: "20:00",
    endTime: "23:00",
    fare: 1200,
    dataSource: "sample",
    reliableAvailability: true,
  },
  {
    id: 3,
    name: "Tirunelveli–Chennai Night Train",
    from: "Tirunelveli",
    to: "Chennai",
    type: "Train",
    startTime: "21:00",
    endTime: "06:00",
    fare: 350,
    dataSource: "sample",
  },

  // ----- Connecting transport -----
  {
    id: 4,
    name: "Tirunelveli–Kovilpatti Night Bus",
    from: "Tirunelveli",
    to: "Kovilpatti",
    type: "Bus",
    startTime: "23:00",
    endTime: "00:00",
    fare: 60,
    dataSource: "sample",
  },
  {
    id: 5,
    name: "Kovilpatti–Madurai Night Bus",
    from: "Kovilpatti",
    to: "Madurai",
    type: "Bus",
    startTime: "00:30",
    endTime: "02:00",
    fare: 100,
    dataSource: "sample",
  },
  {
    id: 6,
    name: "Tirunelveli–Kovilpatti Taxi",
    from: "Tirunelveli",
    to: "Kovilpatti",
    type: "Taxi",
    startTime: "22:30",
    endTime: "23:30",
    fare: 500,
    dataSource: "sample",
    reliableAvailability: true,
  },
  {
    // This record used "id: 4" before (duplicate). It now has its own id.
    id: 7,
    name: "Madurai–Coimbatore Night Train",
    from: "Madurai",
    to: "Coimbatore",
    type: "Train",
    startTime: "22:30",
    endTime: "05:30",
    fare: 250,
    dataSource: "sample",
  },

  // ----- Extra sample records for testing the route logic -----

  // Return trips: they create circular routes (A -> B -> A) that must be avoided
  {
    id: 8,
    name: "Madurai–Tirunelveli Night Bus",
    from: "Madurai",
    to: "Tirunelveli",
    type: "Bus",
    startTime: "22:30",
    endTime: "02:30",
    fare: 150,
    dataSource: "sample",
  },
  {
    id: 9,
    name: "Kovilpatti–Tirunelveli Night Bus",
    from: "Kovilpatti",
    to: "Tirunelveli",
    type: "Bus",
    startTime: "00:15",
    endTime: "01:15",
    fare: 60,
    dataSource: "sample",
  },

  // Share auto marked NOT reliable: the app must never suggest this one
  {
    id: 10,
    name: "Kovilpatti–Madurai Share Auto",
    from: "Kovilpatti",
    to: "Madurai",
    type: "Share Auto",
    startTime: "00:45",
    endTime: "02:15",
    fare: 120,
    dataSource: "sample",
    reliableAvailability: false,
  },

  // Car marked reliable: allowed as a connection
  {
    id: 11,
    name: "Kovilpatti–Madurai Car",
    from: "Kovilpatti",
    to: "Madurai",
    type: "Car",
    startTime: "00:45",
    endTime: "02:00",
    fare: 650,
    dataSource: "sample",
    reliableAvailability: true,
  },

  // Leaves only 10 minutes after bus 4 arrives at Kovilpatti (00:00),
  // so that transfer is too short. It is still valid after taxi 6 (arrives 23:30).
  {
    id: 12,
    name: "Kovilpatti–Madurai Late Bus",
    from: "Kovilpatti",
    to: "Madurai",
    type: "Bus",
    startTime: "00:10",
    endTime: "01:40",
    fare: 90,
    dataSource: "sample",
  },

  // Leaves after midnight, so a 3-leg journey can cross midnight and arrive next day
  {
    id: 13,
    name: "Madurai–Chennai Early Bus",
    from: "Madurai",
    to: "Chennai",
    type: "Bus",
    startTime: "02:30",
    endTime: "09:30",
    fare: 400,
    dataSource: "sample",
  },

  // Leaves in the morning: the wait after arriving in Madurai at night is far too
  // long, so Tirunelveli -> Rameswaram should have no valid alternative
  {
    id: 14,
    name: "Madurai–Rameswaram Morning Bus",
    from: "Madurai",
    to: "Rameswaram",
    type: "Bus",
    startTime: "09:00",
    endTime: "13:00",
    fare: 220,
    dataSource: "sample",
  },
];

export default transportData;
