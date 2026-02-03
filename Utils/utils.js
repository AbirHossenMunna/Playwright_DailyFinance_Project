const generateRandomID = (min, max) => {
  let randomId = Math.random() * (max - min) + min;
  return parseInt(randomId);
};

// Function to generate random future date
function randomFutureDate(daysAhead = 30) {
  const today = new Date();
  const futureDay = Math.floor(Math.random() * daysAhead) + 1;
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + futureDay);

  const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // 01-12
  const day = String(futureDate.getDate()).padStart(2, '0');         // 01-31
  const year = futureDate.getFullYear();

  return `${year}-${month}-${day}`; // ✅ YYYY-MM-DD for type="date"
}

export { generateRandomID, randomFutureDate };
