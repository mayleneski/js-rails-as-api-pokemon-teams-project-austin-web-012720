const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

document.addEventListener('DOMContentLoaded', () => {
 //console.log('DOM Loaded');
  fetchTrainers()
    .then(results => renderAllTrainers(results));
});

function fetchTrainers() {
  return fetch(TRAINERS_URL)
    .then(response => response.json())
};

function renderOneTrainer(trainer) {
  const div = document.createElement('div');
  div.setAttribute('class', 'card');
  div.setAttribute('data-id', trainer.id);
  div.innerHTML = `<p>${trainer.name}</p>
                  <button data-trainer-id=${trainer.id}>Add Pokemon</button>
                  <ul></ul>`;
  const button = div.querySelector('button')
  button.addEventListener('click', addANewPokemon);
  
  trainer.pokemons.forEach(pokemon => {
    const ul = div.querySelector('ul');
    let li = renderOnePokemon(pokemon)
    ul.appendChild(li);
  });
  return div;
}

function renderOnePokemon(pokemon) {
  const li = document.createElement('li');
  li.setAttribute('id', pokemon.id);
  li.innerHTML = `${pokemon.nickname} (${pokemon.species})
                 <button class="release" data-pokemon-id=${pokemon.id}>Release</button>`;
  const button = li.querySelector('button');
  button.addEventListener('click', releasePokemon);               
  return li;
}

function renderAllTrainers(trainersArray) {
  const main = document.querySelector('main');
  trainersArray.forEach(trainer => {
    let div = renderOneTrainer(trainer);
    main.appendChild(div);
  })
};

function releasePokemon(event) {
  const ul = event.target.parentNode.parentNode
  const pokemonId = event.target.dataset.pokemonId;
  fetch(`${POKEMONS_URL}/${pokemonId}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
    .then(response => response.json())
    .then(pokemon => {
      const li = document.getElementById(pokemon.id);
      ul.removeChild(li);
    });
}

function addANewPokemon(event) {
  const trainerId = event.target.dataset.trainerId;
  const div = event.target.parentNode
  data = { trainer_id: trainerId}
  fetch(POKEMONS_URL, {
    method: 'POST',
    headers:  {
      "Content-Type": "application/json",
    "Accept": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(results => {
       const ul = div.querySelector('ul');
       const li = renderOnePokemon(results);
       ul.appendChild(li);
    })
};


  

