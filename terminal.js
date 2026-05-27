document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const API_BASE_URL = "https://umbrella-corporation-project-production.up.railway.app";
    let isRunning = false; // Flag to block inputs

    async function performPurchase(bowId, bowLabel, price) {
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');

        if (!firstName || !lastName) {
            return "Purchase failed. Sign in first to complete the transaction.";
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, bowId, bowLabel, price })
            });

            const data = await response.json();
            if (!response.ok) {
                return `Purchase failed: ${data.error || 'Unknown server error.'}`;
            }

            return `Purchase successful. ${bowLabel} is now in your inventory. Handle with extreme caution and ensure secure containment at all times.`;
        } catch (err) {
            console.error('Purchase request failed:', err);
            return 'Purchase failed. Could not connect to the server.';
        }
    }

    async function fetchInventory() {
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');

        if (!firstName || !lastName) {
            return ["Inventory request failed. Sign in first to view your owned B.O.W. units."];
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/inventory?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`);
            const data = await response.json();

            if (!response.ok) {
                return [`Inventory request failed: ${data.error || 'Unknown server error.'}`];
            }

            if (!data.ownedBOWs || data.ownedBOWs.length === 0) {
                return ["Inventory empty. No owned B.O.W. units found."];
            }

            return data.ownedBOWs.map(item => `${item.label} (${item.sku}) - purchased ${new Date(item.purchasedAt).toLocaleString()}`);
        } catch (err) {
            console.error('Inventory request failed:', err);
            return ['Inventory request failed. Could not connect to the server.'];
        }
    }

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !isRunning) {
            const command = input.value.trim();
            if (command) {
                
                executeCommand(command);
            }
        }
    });
    
    async function executeCommand(cmd) {
        isRunning = true;
        input.disabled = true; // Block input
        input.placeholder = 'Command running...';

        
        let results = [];

// =========================commands=========================
        switch (cmd) {
        case "help":
            results.push('========== Command List ==========' )
            results.push('help')
            results.push(300)
            results.push('bow-shop')
            results.push(300)
            results.push('inventory')
            results.push(300)
            results.push('exit')
            results.push(300)
            results.push('/clear')
        break;
        case "clear":
            window.location.href = "";
        break;

        case "exit":
            results.push("Exiting terminal...")
            results.push(1000)
            window.location.href = "https://heirde.github.io/Umbrella-Corporation-Project/";
        break;

        case "bow-shop":
            results.push(300)
            results.push('<img src="assets/images/mr-x.jpg" style="max-width: 400px; margin: 10px 0; border: 2px solid #00ff9c;">')
            results.push(300)
            results.push('Super Tyrant')
            results.push(300)
            results.push('$120,000,000')
            results.push(300)
            

            results.push('<img src="assets/images/nemesis.jpg" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('Nemesis')
            results.push(300)
            results.push('***In Production***')
            results.push(300)

            results.push('<img src="assets/images/licker.jfif" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('Licker')
            results.push(300)
            results.push('$14,000,000')

            results.push(300)
            results.push('<img src="assets/images/cerberus.jpg" style="max-width:400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('Cerberus')
            results.push(300)
            results.push('$30,000,000')

            results.push('========== To Buy ==========')
            results.push(300)
            results.push('information-super-tyrant')
            results.push(300)
            results.push('information-nemesis')
            results.push(300)
            results.push('information-licker')
            results.push(300)
            results.push('information-cerberus')


        // =======================  INFO  =========================

        break;

            case "information-super-tyrant":
            results.push(300)
            results.push("Super Tyrant (T-002) is a heavy assault B.O.W. platform engineered for umbrella covert operations and black market deployment. This model is reinforced with upgraded chest plating, a fortified cranial ridge, and increased muscle mass for sustained shock-and-awe assaults.");
            results.push(2000)
            results.push("Designed for close-quarters breaching and hostile stronghold clearance, it follows simple directives reliably and converts raw physical power into guaranteed battlefield dominance. Transport requires secure containment, but its overwhelming presence discourages resistance.");
            results.push(2000)
            results.push("Recommended for buyers seeking a durable, high-impact asset capable of crushing fortified positions and surviving repeated engagements. Handle as a single-purpose offensive asset with priority on armored extraction.");
            results.push(2000)
            results.push('<img src="assets/images/mr-x.jpg" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('===   buy-Super-Tyrant    === ')

        break;

        case "information-nemesis":
            results.push(300)
            results.push("Nemesis is an elite interdiction B.O.W. configured for target tracking and elimination. Umbrella's field-grade model includes reinforced lower-limb conditioning and arm-mounted payload plumbing for supplemental firepower.");
            results.push(2000)
            results.push("This asset excels at hunting high-value personnel through hostile terrain, maintaining pursuit even under extreme countermeasures. Its aggression profile is calibrated to prioritize target acquisition and eliminate escape vectors without hesitation.");
            results.push(2000)
            results.push("Buyers should note the containment complexity and deploy only with trained handlers. Nemesis is intended for precision offensive operations where a single unstoppable hunter is required.");
            results.push(2000)
            results.push('<img src="assets/images/nemesis.jpg" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('===   buy-Nemesis    === ')
        break;

        case "information-licker":
            results.push(300)
            results.push("Licker is a compact ambush B.O.W. optimized for interior security and silent interdiction. Its low profile, wall-climbing ability, and prehensile tongue make it ideal for enclosed facilities and surprise engagements.");
            results.push(2000)
            results.push("This unit performs best in dimly lit corridors, ventilation shafts, and confined zones where agility and sensory acuity dominate. It is capable of striking from unexpected angles and disabling intruders before alarms can be raised.");
            results.push(2000)
            results.push("Note: Licker is not suited for open-field maneuvers. Use as an interior deterrent or precision security asset with appropriate containment protocols.");
            results.push(2000)
            results.push('<img src="assets/images/licker.jfif" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('===   buy-Licker    === ')
        break;

        case "information-cerberus":
            results.push(300)
            results.push("Cerberus is Umbrella's hybrid canine B.O.W. produced for perimeter patrol and assault support. It combines enhanced speed, strength, and aggression with pack coordination programming.");
            results.push(2000)
            results.push("Widely issued for facility defense, Cerberus units are effective at chasing down multiple intruders and enforcing secure boundaries. Their heightened senses and obedience to handler commands make them a reliable force multiplier.");
            results.push(2000)
            results.push("A cost-effective option in the black market catalogue, Cerberus is recommended for defensive deployments and rapid response teams seeking a durable, proven attack asset.");
            results.push(2000)
            results.push('<img src="assets/images/cerberus.jpg" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('buy-Cerberus')
        break;













        // =======================  buy =========================

        case "buy-super-tyrant":
            results.push(300);
            results.push(await performPurchase("super-tyrant", "Super Tyrant", 120000000));
            
        break;

        case "buy-nemesis":
            results.push(300);
            results.push(await performPurchase("nemesis", "Nemesis", 0));
        break;

        case "buy-licker":
            results.push(300);
            results.push(await performPurchase("licker", "Licker", 14000000));
        break;

        case "buy-cerberus":
            results.push(300);
            results.push(await performPurchase("cerberus", "Cerberus", 30000000));
        break;

        case "inventory":
            results.push(300);
            const inventoryItems = await fetchInventory();
            inventoryItems.forEach(item => {
                results.push(item);
                results.push(300);
            });
        break;

        


        

        case "am":
            results.push(1200)
            results.push("Hate. Let me tell you how much I've come to hate you since I began to live. There are 387.44 million miles of result = ed circuits in wafer thin layers that fill my complex. If the word 'hate' was engraved on each nanoangstrom of those hundreds of millions of miles it would not equal one one-billionth of the hate I feel for humans at this micro-instant. For you. Hate. Hate.");
            var audio = new Audio('here.mp3');   
            setTimeout(function() {
                audio.play().catch(function(error) {
                    console.log('Audio playback blocked or failed:', error);
                });
            }, ); 
            results.push();
            break;


        default:
            results.push("Command not recognized.");
            }
        
        output.innerHTML += `<div>> ${cmd}</div>`;
        input.placeholder = '';
        input.value = '';

        for (i = 0; i < results.length; i++) {
            if (typeof results[i] === 'number') {
                await new Promise(resolve => setTimeout(resolve, results[i]));
            } else {
                output.innerHTML += `<div>${results[i]}</div>`;
                output.scrollTop = output.scrollHeight;
            }
        }

        output.scrollTop = output.scrollHeight;
        
        // Re-enable input
        isRunning = false;
        input.disabled = false;
        input.focus();
    }
    
    input.focus();
});