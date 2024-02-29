// DOM elements 
const elPokemonsList = document.querySelector(".js-pokemons-list");
const elPokemonTemplate = document.querySelector(".js-pokemons-template").content;

// Form elements 
const elSearchForm = document.querySelector(".search-input-form");
const elSearchInput = elSearchForm.querySelector(".search-input");
const elSelectedWeakness = document.querySelector("#weaknesses-option");
const elMinWeightInput = document.querySelector(".js-minWeight-input");
const elMaxWeightInput = document.querySelector(".js-maxWeight-input");
const elSortedSelect = document.querySelector(".js-sorted-select");


// function to render pokemons list
function renderPokemons (arr, node) {
    
    const PokemonsDocFragment = document.createDocumentFragment();
    const searchInputVal = elSearchInput.value.trim();
    node.innerHTML = "";
    
    for( const poke of arr ) {
        
        const pokemonsTemplateNodes = elPokemonTemplate.cloneNode(true);
        pokemonsTemplateNodes.querySelector(".poke-number").textContent = poke.num;
        pokemonsTemplateNodes.querySelector(".poke-img").src = poke.img;
        pokemonsTemplateNodes.querySelector(".poke-name").innerHTML = searchInputVal ? highlightKeyword(poke.name, searchInputVal) :poke.name;
        pokemonsTemplateNodes.querySelector(".poke-weight").textContent = `Weight: ${ poke.weight}`;
        pokemonsTemplateNodes.querySelector(".poke-candy-count").textContent = `Candy count: ${ poke.candy_count}`;
        pokemonsTemplateNodes.querySelector(".poke-egg").textContent = `Egg size:  ${ poke.egg}`;
        pokemonsTemplateNodes.querySelector(".poke-weakness").textContent = `Weak: ${poke.weaknesses.join(", ")}`;
        
        PokemonsDocFragment.appendChild(pokemonsTemplateNodes);
        
    }
    
    node.appendChild(PokemonsDocFragment);
    
}

renderPokemons(pokemons, elPokemonsList);


// highlihgting keyword 
function highlightKeyword(name, keyword) {
    const regexPokeNmae = new RegExp(keyword, "gi");
    return name.replace(regexPokeNmae, match => `<span class="highlight">${match}</span>`);
}


// unique weaknesses
const weaknesses = [];

pokemons.forEach(item => {
    const pokeWeakness = item.weaknesses;
    
    for( const weak of pokeWeakness) {
        if(!weaknesses.includes(weak)) {
            weaknesses.push(weak)
        }
    }
    
});

const weaknessDocFragment = document.createDocumentFragment();
for (const weakness of weaknesses) {
    const newItem = document.createElement("option");
    newItem.value = weakness;
    newItem.textContent = weakness;
    
    weaknessDocFragment.appendChild(newItem);
}
elSelectedWeakness.appendChild(weaknessDocFragment);


// unique egg values 
const realEggs = [];
pokemons.forEach(item => {
    const PokemonsEgg = item.egg.split(" ");
    const egg = Number(PokemonsEgg.shift());
    if(!isNaN(egg)) {
        realEggs.push(egg)
    }
    
});


// sorted pokemons 
function sortedPokemons (arr, sortVal) {
    
    if(sortVal == "a-z") {
        arr.sort((a, b) => {
            return a.name[0].charCodeAt() - b.name[0].charCodeAt()
        })
    };

    if(sortVal == "z-a") {
        arr.sort((a, b) => {
            return b.name[0].charCodeAt() - a.name[0].charCodeAt()
        })
    };

    if(sortVal == "lowest-candy highest-candy") {
        arr.sort((a, b) => {
            return a.candy_count - b.candy_count
        })
    };

    if(sortVal == "highest-candy lowest-candy") {
        arr.sort((a, b) => {
            return b.candy_count - a.candy_count
        })
    };

    if(sortVal == "lowest-egg") {
        arr.sort((a, b) => {
            const changedEggA = a.egg.split(" ");
            const eggA = Number(changedEggA.shift())
            const changedEggB = b.egg.split(" ");
            const eggB = Number(changedEggB.shift())
            if(!isNaN(eggA) && !isNaN(eggB)) {
                return eggA - eggB
            } else {
                if ((isNaN(eggA)) && (isNaN(eggA)|| isNaN(eggB))) {
                    return 1
                } else {
                    return -1
                }
            }
        })
    };
    
    if(sortVal == "highest-egg") {
        arr.sort((a, b) => {
            const changedEggA = a.egg.split(" ");
            const eggA = Number(changedEggA.shift())
            const changedEggB = b.egg.split(" ");
            const eggB = Number(changedEggB.shift())
            if(!isNaN(eggA) && !isNaN(eggB)) {
                return eggB - eggA
            } else {
                if ((isNaN(eggA)) && (isNaN(eggA)|| isNaN(eggB))) {
                    return 1
                } else {
                    return -1
                }
            }
        })
    };
};


// form submit process 
elSearchForm.addEventListener("submit", function(evt) {
    evt.preventDefault();
    
    const searchInputVal = elSearchInput.value.trim();
    const regexPokeTitle = new RegExp(searchInputVal, "gi");
    const minWeightVal = elMinWeightInput.value;
    const maxWeightVal = elMaxWeightInput.value;
    
    const searchedPokemon = pokemons.filter(item => {
        
        const changedWeight = item.weight.split(" ");
        const weight = Number(changedWeight.shift());
        
        if((searchInputVal == "" || item.name.match(regexPokeTitle)) && (elSelectedWeakness.value == "all" || item.weaknesses.includes(elSelectedWeakness.value)) 
        && (minWeightVal == "" || weight >= elMinWeightInput.value) && (maxWeightVal == "" || weight <= elMaxWeightInput.value)) {
            return item
        }
        
    });
    
    const sortPokeVal = elSortedSelect.value;
    
    if(searchedPokemon.length > 0) {
        sortedPokemons(searchedPokemon, sortPokeVal)
        renderPokemons(searchedPokemon, elPokemonsList)
    }
    
});









