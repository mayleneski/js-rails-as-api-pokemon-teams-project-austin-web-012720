const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

let trainers;
let pokemons;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded");

  fetchTrainers();
});

function fetchTrainers() {
  fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(results => {
      trainers = results;
      renderTrainers();
    });
}

function makeTrainerCard(trainer) {
  const trainerContainer = document.querySelector("main");

  let newDiv = document.createElement("div");
  newDiv.setAttribute("class", "card");
  newDiv.setAttribute("data-id", `${trainer.id}`);

  newDiv.innerHTML = `<p>${trainer.name}</p>
    <button data-trainer-id =${trainer.id}>Add Pokemon</button>
    <ul></ul>`;

  let button = newDiv.querySelector("button");
  button.addEventListener("click", event => {
    const trainerId = event.target.dataset.trainerId;

    const div = event.target.parentNode;
    let ul = div.querySelector("ul");

    let newPokemonPromise = makeANewPokemon(trainerId);

    newPokemonPromise.then(result => {
      let li = createPokemonLi(result);
      ul.appendChild(li);
    });

    console.log(newPokemonPromise);
    
  });

  trainerContainer.appendChild(newDiv);

  trainer.pokemons.forEach(pokemon => {
    let li = createPokemonLi(pokemon);
    let ul = newDiv.getElementsByTagName("ul")[0];

    ul.appendChild(li);
  });
}

function renderTrainers() {
  trainers.forEach(trainer => makeTrainerCard(trainer));
}

function createPokemonLi(pokemon) {
  
  let li = document.createElement("li");
  li.innerHTML = `${pokemon.nickname} (${pokemon.species}) <button class='release' data-pokemon-id=${pokemon.id}>Release</button>`;
  let button = li.querySelector("button");
  button.addEventListener("click", event => {
    deletePokemon(event);
  });

  return li;
}

function deletePokemon(event) {
  const pokemonID = event.target.dataset.pokemonId;
  const pokemonLi = event.target.parentNode;
  const parentNode = event.target.parentNode.parentNode;

  fetch(`http://localhost:3000/pokemons/${pokemonID}`, {
    method: "DELETE"
  });

  parentNode.removeChild(pokemonLi);
}

function makeANewPokemon(trainerID) {
  return fetch(POKEMONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ trainer_id: trainerID })
  }).then(response => response.json());

}
