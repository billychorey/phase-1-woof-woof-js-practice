document.addEventListener("DOMContentLoaded", (event) => {

    let fetchUrl = 'http://localhost:3000/pups';
    let doggoBox = document.getElementById('dog-bar');
    let doggoInfo = document.getElementById('dog-info');

    fetch(fetchUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            data.forEach(item => {
                let dogSpan = document.createElement('span');
                dogSpan.textContent = item.name;
                doggoBox.appendChild(dogSpan);
                console.log(item.name);

                dogSpan.addEventListener('click', () => {
                    displayDogInfo(item);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function displayDogInfo(dog) {
        let contentWrap = document.createElement('div');
        let doggoImg = document.createElement('img');
        doggoImg.src = dog.image; 
        let doggoName = document.createElement('h2');
        doggoName.textContent = dog.name;
        let button = document.createElement('button');

        button.textContent = dog.isGoodDog ? 'good dog' : 'bad dog';

        contentWrap.appendChild(doggoImg);
        contentWrap.appendChild(doggoName);
        contentWrap.appendChild(button);

        button.addEventListener('click', () => {
            // Call the behaviorButton function with the dog's ID and button element
            behaviorButton(dog.id, button);
        });

        doggoInfo.innerHTML = '';
        doggoInfo.appendChild(contentWrap);
    }

    function behaviorButton(dogId, button) {
        const updateUrl = `http://localhost:3000/pups/${dogId}`;
    
        fetch(updateUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Update failed');
                throw new Error('Update failed');
            }
        })
        .then(updatedDog => {
            // Toggle the isGoodDog value
            updatedDog.isGoodDog = !updatedDog.isGoodDog;
    
            // Log the updated value
            console.log(`Updated isGoodDog value: ${updatedDog.isGoodDog}`);
    
            // Update the button text content based on the updated isGoodDog value
            button.textContent = updatedDog.isGoodDog ? 'good dog' : 'bad dog';
    
            // Send a PATCH request to update the server with the new value
            fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isGoodDog: updatedDog.isGoodDog }),
            })
            .then(response => {
                if (!response.ok) {
                    console.error('Update failed');
                }
            })
            .catch(error => {
                console.error('Error updating dog behavior:', error);
            });
        })
        .catch(error => {
            console.error('Error fetching updated dog data:', error);
        });
    }
    

});
