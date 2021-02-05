// document.addEventListener("DOMContentLoaded", () => {}

const propertiesURL = 'http://127.0.0.1:3000/properties'

getAllProperties()

const listingForm = document.querySelector('form')
listingForm.addEventListener('submit', (e) => {
    handleSubmit(e)
})

function getAllProperties() {
    fetch(propertiesURL)
    .then(response => response.json())
    .then(property => property.forEach(property => buildPropertyCard(property)))
}

function patchProperty(e, propertyId) {
    e.preventDefault()

    fetch(`${propertiesURL}/${propertyId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: e.target.children[0].value
        })
        
    })
    .then(response => response.json())
    .then(property => { // The alternative to reset the second portion to "console.log(property)"" but this prevents my form from disappearing upon clicking "save".
        const deleteForm = document.getElementById(property.id).querySelector('form')
        deleteForm.innerHTML = `Updated Status To: ${property.status}`
    })
}

function buildPropertyCard(property) {
    // div with the agent name, the house image, the address, and the status.
    let listingCollection = document.querySelector('#listing-collection')
    let propertyCard = document.createElement('div')
    propertyCard.id = property.id
    propertyCard.className = 'card'
    let agentName = document.createElement('h3')
    agentName.className = 'agent-name'
    let propertyImage = document.createElement('img')
    propertyImage.className = 'house-image'
    let propertyAddress = document.createElement('p')
    propertyAddress.className = 'address'
    let propertyStatus = document.createElement('button')
    propertyStatus.className = 'status-button'
    let deleteBtn = document.createElement('button')
    deleteBtn.className = "delete-listing"

    agentName.textContent = `Agent: ${property.agent.name}`
    propertyImage.src = property.image
    propertyAddress.textContent = property.address
    propertyStatus.textContent = property.status
    deleteBtn.textContent = "X"
    
    propertyStatus.addEventListener('click', (e) => changeStatus(e, property))
    deleteBtn.addEventListener('click', () => deleteListing(property.id))

    propertyCard.append(agentName, propertyImage, propertyAddress, propertyStatus, deleteBtn)
    listingCollection.appendChild(propertyCard)
    
}

function handleSubmit(e) {
    e.preventDefault()

        fetch(propertiesURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                agent: e.target.name.value,
                address: e.target.address.value,
                image: "https://images.unsplash.com/photo-1602836948295-14b195efa63d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=802&q=80",
                status: e.target.status.value
            })
            // document.querySelector('form').reset() will reset the entry, but how do I mix it in with my button.
        })
        .then(response => response.json())
        .then(property => buildPropertyCard(property))
      }

      function deleteListing(id) {
          fetch(`${propertiesURL}/${id}`, {
              method: 'DELETE'
          })
          .then(response => response.json())
          .then(() => {
              let oldListing = document.getElementById(id)
              oldListing.remove()
          })
      }

      function changeStatus(e, property) {
          let button = e.target
          let form = document.createElement('form')
          button.replaceWith(form)

          let select = document.createElement('select')
          let option1 = document.createElement('option')
          let option2 = document.createElement('option')
          let option3 = document.createElement('option')
          let submit = document.createElement('button')
          submit.type = "submit"

          option1.value = "Active"
          option2.value = "Sold"
          option3.value = "Sale Pending"

          option1.textContent = "Active"
          option2.textContent = "Sold"
          option3.textContent = "Sale Pending"
          submit.textContent = "Save"

          form.addEventListener('submit', (e) => patchProperty(e, property.id))

          select.append(option1, option2, option3)
          form.append(select, submit)
      }