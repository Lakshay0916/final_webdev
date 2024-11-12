// Sample slot data for each doctor
const doctorSlots = {
    drJaneDoe: {
      '2024-11-12': ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
      '2024-11-13': ['10:00 AM', '10:30 AM', '11:00 AM'],
    },
    drRosaHernandez: {
      '2024-11-12': ['10:15 AM', '10:45 AM', '11:15 AM', '11:45 AM'],
      '2024-11-13': ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
    },
    drJohnDoe: {
      '2024-11-12': ['10:00 AM', '11:00 AM', '12:00 PM'],
      '2024-11-13': ['10:15 AM', '10:45 AM', '11:15 AM'],
    }
  };
  
  let selectedDoctor = null;
  let selectedSlot = null;
  
  // Function to select a doctor
  function selectDoctor(doctorId) {
    selectedDoctor = doctorId;
    updateSlots();
  }
  
  // Function to update available slots based on selected doctor and date
  function updateSlots() {
    const slotContainer = document.getElementById('slots');
    slotContainer.innerHTML = ''; // Clear previous slots
  
    const selectedDate = document.getElementById('appointment-date').value;
    if (!selectedDoctor || !selectedDate) {
      slotContainer.innerHTML = '<p>Please select a doctor and a date.</p>';
      return;
    }
  
    const slots = doctorSlots[selectedDoctor][selectedDate];
    if (!slots || slots.length === 0) {
      slotContainer.innerHTML = '<p>No slots available for this date.</p>';
      return;
    }
  
    // Render available slots
    slots.forEach(slot => {
      const slotButton = document.createElement('button');
      slotButton.className = 'slot available';
      slotButton.innerText = slot;
      slotButton.onclick = () => selectSlot(slotButton, slot);
      slotContainer.appendChild(slotButton);
    });
  }
  
  // Function to handle slot selection
  function selectSlot(button, slot) {
    // Remove selection from previously selected slot
    const previousSelection = document.querySelector('.slot.selected');
    if (previousSelection) {
      previousSelection.classList.remove('selected');
    }
  
    // Add selection to the current slot
    button.classList.add('selected');
    selectedSlot = slot;
  
    // Enable the "Book Appointment" button
    document.querySelector('.book-button').disabled = false;
  }
  
  // Function to handle booking
  function bookAppointment() {
    if (!selectedDoctor || !selectedSlot) {
      alert("Please select a doctor and a slot.");
      return;
    }
  
    // Retrieve additional booking details
    const date = document.getElementById('appointment-date').value;
    const appointmentType = document.getElementById('appointment-type').value;
    const service = document.getElementById('service').value;
    const description = document.getElementById('description').value;
  
    // Here you would typically send this data to a server
    console.log("Booking Details:", {
      doctor: selectedDoctor,
      date,
      slot: selectedSlot,
      appointmentType,
      service,
      description
    });
  
    alert(`Appointment booked successfully for ${date} at ${selectedSlot}!`);
  }
  
  // Attach the booking function to the button
  document.querySelector('.book-button').addEventListener('click', bookAppointment);
  