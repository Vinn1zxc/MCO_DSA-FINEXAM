// User accounts with credentials
const accounts = [
    { user: "user1", pass: "pass1" },
    { user: "user2", pass: "pass2" }
];

// Static list of available bus fleets (unchanged)
const buses = {
    luxury: [
        { busName: "Luxury-21", price: 700, availableSeats: 30 },
        { busName: "Luxury-22", price: 700, availableSeats: 30 },
        { busName: "Luxury-23", price: 700, availableSeats: 30 },
        { busName: "Luxury-24", price: 700, availableSeats: 30 }
    ],
    aircon: [
        { busName: "Aircon-31", price: 400, availableSeats: 30 },
        { busName: "Aircon-32", price: 400, availableSeats: 30 },
        { busName: "Aircon-33", price: 400, availableSeats: 30 },
        { busName: "Aircon-34", price: 400, availableSeats: 30 }
    ],
    minibus: [
        { busName: "Mini-41", price: 300, availableSeats: 25 },
        { busName: "Mini-42", price: 300, availableSeats: 25 },
        { busName: "Mini-43", price: 300, availableSeats: 25 },
        { busName: "Mini-44", price: 300, availableSeats: 25 }
    ],
    uvx: [
        { busName: "UVX-51", price: 150, availableSeats: 20 },
        { busName: "UVX-52", price: 150, availableSeats: 20 },
        { busName: "UVX-53", price: 150, availableSeats: 20 },
        { busName: "UVX-54", price: 150, availableSeats: 20 }
    ]
};

// Log of reservations made
const bookings = [];

// Holds current user session
let currentUser = null;

// Sign-in system
function signIn() {
    let uname = prompt("Username:");
    let pwd = prompt("Password:");
    const found = accounts.find(acc => acc.user === uname && acc.pass === pwd);

    if (found) {
        currentUser = uname;
        alert(`Welcome, ${uname}!`);
        return true;
    }

    alert("Access denied.");
    return false;
}

// Prompt for bus category and show options
function getBusSelection() {
    const category = prompt("Select bus category: luxury, aircon, minibus, uvx").toLowerCase();
    const options = buses[category];

    if (!options) {
        alert("Category not found.");
        return null;
    }

    let details = options.map((bus, i) => `${i + 1}: ${bus.busName} - ₱${bus.price} - Seats: ${bus.availableSeats}`).join("\n");
    alert("Buses available:\n" + details);

    let chosen = parseInt(prompt("Enter bus number:")) - 1;
    if (chosen < 0 || chosen >= options.length) {
        alert("Invalid selection.");
        return null;
    }

    return { category, index: chosen };
}

// Add a new booking
function addBooking() {
    const selection = getBusSelection();
    if (!selection) return;

    const ride = buses[selection.category][selection.index];
    if (ride.availableSeats <= 0) {
        alert("Fully booked.");
        return;
    }

    let seat = prompt("Input seat number:");

    // Check for duplicate booking
    if (bookings.find(b => b.user === currentUser && b.bus === ride.busName && b.seat === seat)) {
        alert("You've already booked this seat.");
        return;
    }

    // Save booking
    bookings.push({
        user: currentUser,
        bus: ride.busName,
        seat,
        cost: ride.price,
        paid: false,
        proof: ""
    });

    ride.availableSeats--;
    alert("Seat successfully booked!");
}

// Remove a reservation
function deleteBooking() {
    const bname = prompt("Enter bus name to cancel:");
    const snum = prompt("Enter seat number to cancel:");

    const index = bookings.findIndex(r => r.user === currentUser && r.bus === bname && r.seat === snum);

    if (index === -1) {
        alert("Booking not found.");
        return;
    }

    const removed = bookings.splice(index, 1)[0];

    // Restore seat
    const busGroup = buses[removed.category];
    for (let group in buses) {
        for (let b of buses[group]) {
            if (b.busName === removed.bus) {
                b.availableSeats++;
                break;
            }
        }
    }

    alert("Booking canceled.");
}

// Upload payment proof
function confirmPayment() {
    const bname = prompt("Bus name:");
    const snum = prompt("Seat number:");
    const image = prompt("Upload receipt filename or URL:");

    const record = bookings.find(b => b.user === currentUser && b.bus === bname && b.seat === snum);

    if (!record) {
        alert("No matching booking.");
        return;
    }

    record.paid = true;
    record.proof = image;
    alert("Payment confirmed.");
}

// Show all bookings
function displayBookings() {
    if (bookings.length === 0) {
        alert("No bookings found.");
        return;
    }

    let summary = bookings.map(b =>
        `User: ${b.user}\nBus: ${b.bus}\nSeat: ${b.seat}\nCost: ₱${b.cost}\nPaid: ${b.paid ? "Yes" : "No"}\nProof: ${b.proof || "N/A"}`
    ).join("\n\n");

    alert(summary);
}

// System control panel
function runApp() {
    if (!signIn()) return;

    while (true) {
        const input = prompt(
            "Options:\n1. Reserve a Seat\n2. Cancel Reservation\n3. Pay\n4. Show Bookings\n5. Logout"
        );

        switch (input) {
            case "1": addBooking(); break;
            case "2": deleteBooking(); break;
            case "3": confirmPayment(); break;
            case "4": displayBookings(); break;
            case "5":
                alert("You have been logged out.");
                currentUser = null;
                return;
            default:
                alert("Not a valid option.");
        }
    }
}

// Launch the program
runApp();