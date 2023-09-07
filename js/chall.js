const CHALLENGES = [
	{
		name: "Stable",
		desc: "You can't roll anything.",
		reward(){
			return "Boost PU2 effect based on best rarity in this challenge. Currently: "+format(player.chall[0].add(1).log10().div(90).add(1));
		},
	},
	{
		name: "Unlucky",
		desc: "Your luck multiplier is 1.",
		reward(){
			return "Boost luck multiplier based on best rarity in this challenge. Currently: ^"+format(player.chall[1].add(1).log10().div(90).add(1));
		},
		unl(){
			return player.chall[0].gte(50000);
		},
	}
]


function startChall(a){
	MAIN.mastery.doReset();
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