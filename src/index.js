document.addEventListener("DOMContentLoaded", () => {
    const dogForm = document.getElementById("dog-form");
    const tableBody = document.getElementById("table-body");
  
    // Function to fetch and render the list of registered dogs
    const fetchDogs = () => {
      fetch("http://localhost:3000/dogs")
        .then((response) => response.json())
        .then((dogs) => {
          tableBody.innerHTML = ""; // Clear existing table rows
  
          dogs.forEach((dog) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${dog.name}</td>
              <td>${dog.breed}</td>
              <td>${dog.sex}</td>
              <td><button class="edit-button" data-id="${dog.id}">Edit</button></td>
            `;
  
            tableBody.appendChild(row);
          });
        })
        .catch((error) => console.error("Error fetching dogs:", error));
    };
  
    // Function to populate the form with dog's information
    const populateForm = (dog) => {
      const formInputs = dogForm.elements;
  
      formInputs.name.value = dog.name;
      formInputs.breed.value = dog.breed;
      formInputs.sex.value = dog.sex;
    };
  
    // Function to handle form submission
    const handleFormSubmit = (event) => {
      event.preventDefault();
  
      const formInputs = dogForm.elements;
      const dogId = dogForm.dataset.id;
  
      const updatedDog = {
        name: formInputs.name.value,
        breed: formInputs.breed.value,
        sex: formInputs.sex.value,
      };
  
      fetch(`http://localhost:3000/dogs/${dogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDog),
      })
        .then((response) => response.json())
        .then(() => {
          fetchDogs(); // Refresh the table with updated dog information
          dogForm.reset(); // Clear the form
        })
        .catch((error) => console.error("Error updating dog:", error));
    };
  
    // Event listener for the edit buttons
    tableBody.addEventListener("click", (event) => {
      if (event.target.classList.contains("edit-button")) {
        const dogId = event.target.dataset.id;
  
        fetch(`http://localhost:3000/dogs/${dogId}`)
          .then((response) => response.json())
          .then((dog) => {
            populateForm(dog); // Populate the form with dog's information
            dogForm.dataset.id = dogId; // Store the dog's ID in the form dataset
          })
          .catch((error) => console.error("Error fetching dog:", error));
      }
    });
  
    // Event listener for form submission
    dogForm.addEventListener("submit", handleFormSubmit);
  
    // Fetch and render the list of registered dogs on page load
    fetchDogs();
  });
  