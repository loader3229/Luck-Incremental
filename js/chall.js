const CHALLENGES = [
	{
		name: "Stable",
		desc: "You can't roll anything.",
		reward(){
			return "Boost PU2 effect based on best rarity in this challenge. Currently: "+format(player.chall[0].add(1).log10().div(90).add(1).mul(player.chall[4].add(1).log10().div(90).add(1)).mul(player.chall[6].add(1).log10().div(90).add(1)).mul(player.chall[9].add(1).log10().div(90).add(1)));
		},
	},
	{
		name: "Unlucky",
		desc: "Your luck multiplier is 1.",
		reward(){
			return "Boost luck multiplier based on best rarity in this challenge. Currently: ^"+format(player.chall[1].add(1).log10().div(90).add(1).mul(player.chall[3].add(1).log10().div(90).add(1)).mul(player.chall[7].add(1).log10().div(90).add(1)));
		},
		unl(){
			return player.chall[0].gte(50000);
		},
	},
	{
		name: "No Prestige",
		desc: "You can't gain any prestige points.",
		reward(){
			return "Boost base prestige points based on best rarity in this challenge. Currently: ^"+format(player.chall[2].add(1).log10().div(90).add(1).mul(player.chall[3].add(1).log10().div(90).add(1)).mul(player.chall[4].add(1).log10().div(90).add(1)));
		},
		unl(){
			return player.chall[1].gte(50000);
		},
	},
	{
		name: "No Prestige + Unlucky",
		desc: "You can't gain any prestige points. Your luck multiplier is 1.",
		reward(){
			return "Boost rewards of subchallenges.";
		},
		unl(){
			return player.chall[2].gte(50000);
		},
	},
	{
		name: "No Prestige + Stable",
		desc: "You can't gain any prestige points. You can't roll anything.",
		reward(){
			return "Boost rewards of subchallenges.";
		},
		unl(){
			return player.chall[3].gte(50000);
		},
	},
	{
		name: "No Prestige & Transcend",
		desc: "You can't gain any prestige & transcension points.",
		reward(){
			return "Boost base transcension points based on best rarity in this challenge. Currently: ^"+format(player.chall[5].add(1).log10().div(90).add(1).mul(player.chall[6].add(1).log10().div(90).add(1)).mul(player.chall[7].add(1).log10().div(90).add(1)));
		},
		unl(){
			return player.chall[4].gte(50000);
		},
	},
	{
		name: "No Prestige & Transcend + Stable",
		desc: "You can't gain any prestige & transcension points. You can't roll anything.",
		reward(){
			return "Boost rewards of subchallenges.";
		},
		unl(){
			return player.chall[5].gte(50000);
		},
	},
	{
		name: "No Prestige & Transcend + Unlucky",
		desc: "You can't gain any prestige & transcension points. Your luck multiplier is 1.",
		reward(){
			return "Boost rewards of subchallenges.";
		},
		unl(){
			return player.chall[6].gte(50000);
		},
	},
	{
		name: "No Prestige, Transcend & Reincarnate",
		desc: "You can't gain any prestige, transcension & reincarnation points.",
		reward(){
			return "Boost base reincarnation points based on best rarity in this challenge. Currently: ^"+format(player.chall[8].add(1).log10().div(90).add(1).mul(player.chall[9].add(1).log10().div(90).add(1)));
		},
		unl(){
			return player.chall[7].gte(50000);
		},
	},
	{
		name: "No Prestige, Transcend & Reincarnate + Stable",
		desc: "You can't gain any prestige, transcension & reincarnation points. You can't roll anything.",
		reward(){
			return "Boost rewards of subchallenges.";
		},
		unl(){
			return player.chall[8].gte(50000);
		},
	},
	{
		name: "No Alpha",
		desc: "You can't gain any prestige, transcension, reincarnation & ascension points.",
		reward(){
			return "Boost ascension points based on best rarity in this challenge. Currently: "+formatMult(hasUpgrade('se',9)?player.chall[10].add(1):player.chall[10].add(1).log10().add(1));
		},
		unl(){
			return player.chall[9].gte(50000);
		},
	}
]


function startChall(a){
	MAIN.mastery.doReset();let el=tmp.el;resetTemp();tmp.el=el;
	player.currentChall = a;
}

function exitChall(){
	if(player.currentChall == -1)return;
	MAIN.mastery.doReset();
	player.currentChall = -1;
}

el.setup.chall = function(){
    let us = CHALLENGES, h = ""
    for (let i in us) {
        let u = us[i]
        h += `<button id=chall${i} onclick=startChall(${i})></button>`;
    }
    new Element("challenges").setHTML(h)
}

el.update.chall = function(){
	tmp.el.unlockChall.setHTML(
		player.chall[0].lt(50000)?'Reach '+getRarityName(E(50000)).bold()+' in [Stable] to unlock next challenge':
		player.chall[1].lt(50000)?'Reach '+getRarityName(E(50000)).bold()+' in [Unlucky] to unlock next challenge':
		player.chall[2].lt(50000)?'Reach '+getRarityName(E(50000)).bold()+' in [No Prestige] to unlock next challenge':
		player.chall[3].lt(50000)?'Reach '+getRarityName(E(50000)).bold()+' in [No Prestige + Unlucky] to unlock next challenge':
		player.chall[4].lt(50000)?'Reach '+getRarityName(E(50000)).bold()+' in [No Prestige + Stable] to unlock next challenge':
		player.chall[5].lt(50000)?'Reach '+getRarityName(E(50000)).bold()+' in [No Prestige & Transcend] to unlock next challenge':
		player.chall[6].lt(50000)?'Reach '+getRarityName(E(50000)).bold()+' in [No Prestige & Transcend + Stable] to unlock next challenge':
		player.chall[7].lt(50000)?'Reach '+getRarityName(E(50000)).bold()+' in [No Prestige & Transcend + Unlucky] to unlock next challenge':
		player.chall[8].lt(50000)?'Reach '+getRarityName(E(50000)).bold()+' in [No Prestige, Transcend & Reincarnate] to unlock next challenge':
		player.chall[9].lt(50000)?'Reach '+getRarityName(E(50000)).bold()+' in [No Prestige, Transcend & Reincarnate + Stable] to unlock next challenge':
		'You unlocked all challenges!');
	tmp.el.currentChall.setHTML(player.currentChall==-1?'You are not in any challenge.':'You are in challenge ['+CHALLENGES[player.currentChall].name+']');
	
    let us = CHALLENGES

    for (let i in us) {
        let u = us[i], u_el = tmp.el["chall"+i], unl = !u.unl||u.unl()
		
        u_el.setDisplay(unl)

        if (!unl) continue;
		let h = ""
        h += `
			${u.name}<br>
            ${u.desc}<br>
            Reward: ${u.reward()}<br>
            Best Rarity: ${getRarityName(player.chall[i]).bold()}<br>
		`;
        u_el.setHTML(h)
    }
}