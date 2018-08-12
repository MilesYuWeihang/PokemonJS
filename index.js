const request = require('request')


function Pokemon(n){ 
	//since we request  url(pokemon and damage) for each pokemon initilization
	// we set flag requests=types to active compaire function
	this.request = 0; 
	this.name = n;
	this.stat = 0;
	this.types = [];
	this.dtables = [];
	this.print = print;
	//test use print property
	function print(){
		if(this.request >= this.types.length){
			console.log(this.dtables.length);
		}
	}
}
//pokemon
const urlhead = 'http://pokeapi.co/api/v2/pokemon/'
const args = process.argv;
var Pokes = [args[2],args[3]];//store name,num first, then Pokemon object
var url = [urlhead + Pokes[0],urlhead + Pokes[1]];
var page = [];
//flag to check if all pokemon is init
var pokeBuilt = 0;

//get name of pokemons
function initPokemon(i){
	request.get(url[i], (error, response, data) => {
		page[i] = JSON.parse(data);
		try{
			Pokes[i] = page[i].forms[0].name;
		}
		catch(e){
			throw("pokemon No. or name: " + Pokes[i] + " is invalid")
		}
		Pokes[i] = new Pokemon(Pokes[i]);
		var typeNum = page[i].types.length;
		//get types of poke
		for(var k = 0; k< typeNum; k++){
			Pokes[i].types.push(page[i].types[k].type.name);
		}
		//get state num
		for(var k = 0; k< 6; k++){
			Pokes[i].stat += page[i].stats[k].base_stat;
		}

		//fill dtables
		for(var k = 0; k< typeNum; k++){
			var durl = page[i].types[k].type.url;
			getDamageRelation(durl,Pokes[i]);
		}
		//add flag, show the init complete
		pokeBuilt += 1;
		// console.log(Pokes[i].types);
		// console.log(Pokes[i].stat);
	})
}


//get type relation table
function getDamageRelation(url, pokemon){
	var res;
	request.get(url, (error, response, data) => {
		var page = JSON.parse(data);
		var table = new Object();
		
		table.noDamage = [];
		table.halfDamage = [];
		table.doubleDamage = [];

		var damage0 = page.damage_relations.no_damage_to;
		for(var n in damage0){
			table.noDamage.push(damage0[n].name);
		}

		var damage1 = page.damage_relations.half_damage_to;
		for(var n in damage1){
			table.halfDamage.push(damage1[n].name);
		}

		var damage2 = page.damage_relations.double_damage_to;
		for(var n in damage2){
			table.doubleDamage.push(damage2[n].name);
		}
		pokemon.dtables.push(table);
		pokemon.request += 1;	//check if all damage table filled
		pokeCompare();
	})
}

// get damage time of poke1 to poke2
function getDamage(poke1, poke2){
	var max = -1;
	for(var i = 0; i < poke2.types.length; i++){
		var time = 1;
		for(var j = 0; j < poke1.dtables.length; j++){		
			if (poke1.dtables[j].noDamage.indexOf(poke2.types[i]) != -1){
				time *= 0;
			}
			else if (poke1.dtables[j].halfDamage.indexOf(poke2.types[i]) != -1){
				time *= 0.5;
			}
			else if (poke1.dtables[j].doubleDamage.indexOf(poke2.types[i]) != -1){
				time *= 2;
			}
		}
		if(time > max){
			max = time;
		}
	}
	return max;

}

// finally compare type advantage/base stat of pokemon
function pokeCompare(){
	//check if asyn is complete
	if (pokeBuilt != 2){
		return;
	}
	if(Pokes[0].length === 0 || Pokes[1].length === 0){
		return; 
	}
	if(Pokes[0].types.length != Pokes[0].request || Pokes[1].types.length != Pokes[1].request){
		return;
	}
	//compare type
	var pk1damage = getDamage(Pokes[0],Pokes[1]);
	var pk2damage = getDamage(Pokes[1],Pokes[0]);
	if(pk1damage === pk2damage){
		if(Pokes[0].stat === Pokes[1].stat){
			console.log(Pokes[0].name);
		}
		else if(Pokes[0].stat > Pokes[1].stat){
			console.log(Pokes[0].name);
		}
		else{
			console.log(Pokes[1].name);
		}
	}
	else if (pk1damage > pk2damage){
		console.log(Pokes[0].name);
	}
	else{
		console.log(Pokes[1].name);
	}
}

// main process
initPokemon(0);
initPokemon(1);