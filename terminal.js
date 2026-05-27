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
            results.push('virus-shop')
            results.push(300)
            results.push('organisations')
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
            window.location.href = "./index.html";
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
            results.push('buy-Super-Tyrant')

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
            results.push('buy-Nemesis')
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
            results.push('buy-Licker')
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

        case "buy-progenitor-virus":
            results.push(300);
            results.push(await performPurchase("progenitor-virus", "Progenitor Virus", 120000000));
        break;

        case "buy-t-virus":
            results.push(300);
            results.push(await performPurchase("t-virus", "T-Virus", 15000000));
        break;

        case "buy-t-veronica-virus":
            results.push(300);
            results.push(await performPurchase("t-veronica-virus", "T-Veronica Virus", 20000000));
        break;

        case "buy-g-virus":
            results.push(300);
            results.push(await performPurchase("g-virus", "G-Virus", 30000000));
        break;

        case "buy-t-abyss-virus":
            results.push(300);
            results.push(await performPurchase("t-abyss-virus", "T-Abyss Virus", 20000000));
        break;

        case "buy-prototype-virus-e-series-megamycete":
            results.push(300);
            results.push(await performPurchase("prototype-virus-e-series-megamycete", "Prototype Virus (E-Series) Megamycete", 100000000));
        break;

        case "inventory":
            results.push(300);
            const inventoryItems = await fetchInventory();
            inventoryItems.forEach(item => {
                results.push(item);
                results.push(300);
            });
        break;



        // =======================  virus shop  =========================

        case "virus-shop":
            results.push(300)
            results.push('<img src="assets/images/progenitor.png" style="max-width: 400px; margin: 10px 0; border: 2px solid #00ff9c;">')
            results.push(300)
            results.push('Progenitor Virus')
            results.push(300)
            results.push('$10,000,000')
            results.push(300)
            

            results.push('<img src="assets/images/t-virus.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('T-Virus')
            results.push(300)
            results.push('$15,000,000')
            results.push(300)

            results.push('<img src="assets/images/t-veronica.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('T-Veronica Virus')
            results.push(300)
            results.push('$20,000,000')

            results.push(300)
            results.push('<img src="assets/images/g-virus.png" style="max-width:400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('G-Virus')
            results.push(300)
            results.push('$30,000,000')

            results.push(300)
            results.push('<img src="assets/images/t-abyss.png" style="max-width:400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('T-Abyss Virus')
            results.push(300)
            results.push('$20,000,000')

            results.push(300)
            results.push('<img src="assets/images/megamycete.png" style="max-width:400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('Prototype Virus(E-Series) Megamycete')
            results.push(300)
            results.push('$100,000,000')



            results.push('========== To Buy ==========')
            results.push(300)
            results.push('information-progenitor-virus')
            results.push(300)
            results.push('information-t-virus')
            results.push(300)
            results.push('information-t-veronica-virus')
            results.push(300)
            results.push('information-g-virus')
            results.push(300)
            results.push('information-t-abyss-virus')
            results.push(300)
            results.push('information-prototype-virus-e-series-megamycete')
        break;

        // =======================  INFO  =========================



            case "information-progenitor-virus":
            results.push(300)
            results.push("The Progenitor Virus, also known as the Mother Virus, is the original viral strain discovered within the progenitor flower in Africa. It was weaponized by Umbrella Corporation to serve as the genetic basis for all subsequent B.O.W. viruses and is characterized by its ability to rapidly mutate and adapt to host organisms.");
            results.push(2000)
            results.push("This virus is highly unstable and requires specialized containment protocols. It is extremely difficult to control and prone to unexpected mutations. It is primarily used for research and development purposes within Umbrella's secretive laboratories, and is not recommended for field deployment due to its unpredictable nature.");
            results.push(2000)
            results.push("Buyers should exercise extreme caution when handling the Progenitor Virus, as it can lead to catastrophic outbreaks if not properly contained. It is intended for advanced research applications only.");
            results.push(2000)
            results.push('<img src="assets/images/progenitor.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('===   buy-progenitor-virus    === ')

        break;

        case "information-t-virus":
            results.push(300)
            results.push("The T-Virus is a highly contagious and mutagenic virus derived from the Progenitor Virus and engineered by Umbrella Corporation for widespread bioweapon deployment. It causes rapid cellular mutation, leading to the transformation of infected hosts into aggressive, zombie-like creatures. The virus can be transmitted through bodily fluids and has a devastating mortality rate.");
            results.push(2000)
            results.push("This virus is widely known for its catastrophic role in the Raccoon City outbreak and is considered one of Umbrella's most infamous and effective creations. It has been used as the basis for numerous B.O.W. variants and is highly resistant to environmental degradation, making it ideal for large-scale deployment.");
            results.push(2000)
            results.push("Buyers should be aware of the extreme risks associated with the T-Virus, including potential outbreaks, uncontrollable mutations, and exponential transmission. It is intended for use in highly secure environments with strict containment protocols.");
            results.push(2000)
            results.push('<img src="assets/images/t-virus.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('===   buy-t-virus    === ')
        break;

        case "information-t-veronica-virus":
            results.push(300)
            results.push("The T-Veronica Virus is a highly aggressive and unstable virus derived from the Progenitor Virus and engineered at Umbrella's Rockfort Island facility. It causes rapid and extreme cellular mutation, leading to the transformation of infected hosts into highly intelligent and powerful bio-organic weapons. The virus requires direct blood contact for transmission.");
            results.push(2000)
            results.push("This virus is considered more dangerous than the T-Virus due to its ability to enhance cognitive function while amplifying aggression. The Rockfort Island incident demonstrated its catastrophic potential when containment protocols failed. T-Veronica creates exponentially more dangerous B.O.W. variants.");
            results.push(2000)
            results.push("Buyers should exercise extreme caution when handling the T-Veronica Virus. Its intelligence-enhancing properties make resulting creatures far more lethal than standard T-Virus mutations. Containment is significantly more difficult and it is intended for use only by highly trained operators in maximum-security environments.");
            results.push(2000)
            results.push('<img src="assets/images/t-veronica.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('===   buy-t-veronica-virus    === ')
        break;

        case "information-g-virus":
            results.push(300)
            results.push("The G-Virus is a highly unstable and aggressive virus developed by Dr. William Birkin at Umbrella Corporation. It causes extreme cellular expansion and mutation, leading to the transformation of infected hosts into towering, nearly unstoppable bio-organic weapons. The virus requires direct contact with contaminated tissue for transmission.");
            results.push(2000)
            results.push("This virus is widely considered more lethal and harder to control than the T-Virus. Its role in the Raccoon City outbreak demonstrated its catastrophic potential, producing mutations capable of consuming and adapting to organic matter. The resulting creatures grow progressively larger and more dangerous.");
            results.push(2000)
            results.push("Buyers should exercise extreme caution when handling the G-Virus, as infected hosts become increasingly hostile and unpredictable. It can lead to geometric escalation of threats if containment fails. It is intended for use only by experienced operatives in maximum-security environments with multiple fail-safes.");
            results.push(2000)
            results.push('<img src="assets/images/g-virus.jpg" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('===   buy-g-virus    === ')
        break;

        case "information-t-abyss-virus":
            results.push(300)
            results.push("The T-Abyss Virus is a highly aggressive and fast-acting virus developed by Umbrella Corporation for aquatic bioweapon applications. It causes rapid cellular mutation, leading to the transformation of infected hosts into powerful, bio-organic weapons. The virus is transmitted through direct contact and has a high mortality rate.");
            results.push(2000)
            results.push("This virus is known for its role in aquatic research operations and is considered one of Umbrella's most dangerous creations. It is primarily used for offshore defense and oceanic offensive operations. Due to its uncontrollable nature and affinity for water-based transmission, it is not recommended for terrestrial deployment.");
            results.push(2000)
            results.push("Buyers should exercise extreme caution when handling the T-Abyss Virus, as it can lead to catastrophic outbreaks if not properly contained. It is intended for use in highly secure environments with strict containment protocols.");
            results.push(2000)
            results.push('<img src="assets/images/t-abyss.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('buy-t-abyss-virus')
        break;
        
        case "information-prototype-virus-e-series-megamycete":
            results.push(300)
            results.push("The Megamycete is not a virus but a parasitic fungal organism that originated from an ancient mold discovered in eastern Europe. It serves as the biological foundation for mutations and transformations, fundamentally different from conventional viral weaponry. The organism spreads through spore transmission and parasitic infection.");
            results.push(2000)
            results.push("Unlike viral B.O.W.s, Megamycete-infected hosts retain elevated intelligence and retain vestiges of their original personality, making them far more dangerous. The organism integrates at a cellular level and provides enhanced physical capabilities, regenerative properties, and extended lifespans. It was used experimentally by Umbrella successor organizations.");
            results.push(2000)
            results.push("Buyers should understand that Megamycete is fundamentally different from standard bioweapons - it creates semi-sentient, durable assets rather than disposable soldiers. Its parasitic nature makes it extremely difficult to control or eliminate once established. Handle only with expertise in parasitic organism containment and expect significantly higher operational complexity.");
            results.push(2000)
            results.push('<img src="assets/images/megamycete.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
            results.push('buy-prototype-virus-e-series-megamycete')
        break;


        // =======================  Orgonisation  =========================


        case "organisations":
            results.push(300)
            results.push('umbrella-corporation')
            results.push(300)
            results.push('blue umbrella corporation')
            results.push(300)
            results.push('BSAA')
            results.push(300)
            results.push('connections')
            results.push(300)
            results.push('DSO')
            results.push(300)
            results.push('tricell')
        break;




            case "umbrella-corporation":
            results.push(300)
            results.push("Umbrella Corporation presents itself as a global pharmaceutical and biotech firm, but its real operations are far darker. The public face conceals a layered hierarchy of shell companies and hidden research facilities dedicated to B.O.W. and viral weapon development.");
            results.push(2000)
            results.push("Umbrella's true centers of power are secret laboratories, underground testing sites, and corporate branches that exist only to funnel funds and resources into classified bio-weapon programs. Very little of this activity is visible in official records.");
            results.push(2000)
            results.push("The company built its reputation through legitimate products, then used that cover to move dangerous assets, recruit covert operatives, and support black market distribution channels. Buyers should assume Umbrella's official narrative is only one layer of its operations.");
            results.push(2000)
            results.push("Acquire Umbrella products only with maximum containment and plausible deniability. This organization is not a normal supplier — it is a shadow operator built around secrecy, profit, and the concealment of biological threats.");
            results.push(2000)
            results.push('<img src="assets/images/Umbrella_Corporation_logo.svg.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
        break;

        case "blue umbrella corporation":
            results.push(300)
            results.push("Blue Umbrella Corporation began as a restructuring effort led by former Umbrella employees after the original company's collapse. It presents itself as a transparent biotech firm focused on public health, pharmaceuticals, and responsible research.");
            results.push(2000)
            results.push("Its product lines emphasize medical treatments and legitimate pharmaceuticals, but some insiders note that its leadership still carries the same industry experience and experimental mindset that powered Umbrella's darker programs.");
            results.push(2000)
            results.push("Buyers should treat Blue Umbrella as a cautious choice: generally safer than Umbrella, yet still operating in a world shaped by the same bioweapon legacy. Verify sources and containment protocols before acquiring any materials.");
            results.push(2000)
            results.push('<img src="assets/images/blue-umbrella.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
        break;

        case "BSAA":
            results.push(300)
            results.push("The Bioterrorism Security Assessment Alliance (BSAA) is an international response organization created to counter bio-organic threats and bioterrorism incidents. It was formed by governments after multiple Umbrella-related outbreaks showed the need for a dedicated global force.");
            results.push(2000)
            results.push("BSAA operations are centered on containment, rescue, and investigation rather than weapons development. Its teams deploy to outbreak zones, recover evidence, and coordinate with local military and research units.");
            results.push(2000)
            results.push("Connections between BSAA and the black market are minimal in official records. This group is best viewed as a cleanup and security force, not a supplier, though its intelligence can influence what buyers choose to avoid.");
            results.push(2000)
            results.push('<img src="assets/images/bsaa.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
        break;

        case "connections":
            results.push(300)
            results.push("Connections is a shadow broker in the underground B.O.W. economy. It is not a formal corporation so much as a whispered network of anonymous intermediaries, safe houses, and hidden transfer nodes used to move dangerous assets without leaving a visible trail.");
            results.push(2000)
            results.push("Umbrella has very little concrete intelligence on the group itself. Most files describe only isolated contacts, unverified transfer routes, and payments routed through layers of front companies. Direct links are intentionally sparse and compartmentalized.");
            results.push(2000)
            results.push("What can be said is that Connections appears to specialize in discreet asset movement, covert procurement, and cold introductions between buyers and obscure suppliers. Its real structure is deliberately obscured, and its true leadership remains unknown.");
            results.push(2000)
            results.push("Exercise extreme caution. If Connections is involved, expect only partial information, no formal guarantees, and the need for absolute discretion. Verify everything independently and assume the organization will disappear the moment attention grows.");
            results.push(2000)
            results.push('<img src="assets/images/connections.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
        break;

        case "DSO":
            results.push(300)
            results.push("The Department of Strategic Operations (DSO) is a classified national task force that handles extreme biohazard and security incidents. It functions as a government rapid-response unit for cases too sensitive for ordinary military or law enforcement.");
            results.push(2000)
            results.push("DSO deployments are typically secret, and its true mandate is closely held by senior government officials. The agency is known to collaborate with military, intelligence, and emergency response services while keeping a low public profile.");
            results.push(2000)
            results.push("From Umbrella's perspective, DSO is a threat to covert asset movement rather than a commercial partner. Its presence usually means a site is compromised and buyers should assume increased surveillance and intervention.");
            results.push(2000)
            results.push('<img src="assets/images/dso.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
        break;

        case "tricell":
            results.push(300)
            results.push("TriCell is a private military contractor that became deeply involved in bio-weapon transport, security, and field operations. Its reputation in Umbrella files is that of a mercenary network willing to move hazardous assets for the right price.");
            results.push(2000)
            results.push("The company maintains a portfolio of armed security, logistics, and covert insertion services, often working through shell entities and anonymous contracts. Official links to governments are hard to confirm, and much of TriCell's business is conducted off the books.");
            results.push(2000)
            results.push("Umbrella intelligence treats TriCell as a practical asset when secrecy matters, but also as a liability due to its unpredictable loyalties and exposure risk. Use only when other channels are burned and expect minimal transparency.");
            results.push(2000)
            results.push("Buyers should assume TriCell operates via hidden backchannels, shadow contracts, and third-party intermediaries. Secure every transaction carefully and do not rely on formal documentation or public disclosure.");
            results.push(2000)
            results.push('<img src="assets/images/tricell.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
        break;

              // =======================  founders  =========================

        case "founders":
            results.push('========== Founders ==========')
            results.push(300)
            results.push('Oswell E. Spencer - Founder')
            results.push(300)
            results.push('Dr. James Marcus - Key Researcher')
            results.push(300)
            results.push('Dr. Edward Ashford - Key Researcher')
            results.push(300)
            results.push('Dr. Alexander Ashford - Key Scientist')
            results.push(300)
        break;

        case "Dr. James Marcus Key - Researcher":
            results.push(300)
            results.push("Dr. James Marcus was a key researcher and one of the most important figures in the development of the Progenitor Virus under Umbrella Corporation. His work laid the foundation for all subsequent viral research, but his obsession with bioweapons ultimately led to his downfall.");
            results.push(2000)
            results.push("Marcus's research was groundbreaking but ethically compromised, and his methods were often reckless. He was eventually betrayed by his colleagues and met a grim end, but his legacy lives on in the viruses and B.O.W.s that continue to shape the black market.");
            results.push(2000)
            results.push("Buyers should view Marcus as a cautionary tale of unchecked ambition in bioweapons research. His contributions are significant, but his story is also a reminder of the dangers inherent in this line of work.");
            results.push(2000)
            results.push('<img src="assets/images/marcus.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
        break;

        case "Oswell E. Spencer - Founder":
            results.push(300)
            results.push("Oswell E. Spencer was the enigmatic founder and long-time leader of Umbrella Corporation. A visionary with a ruthless streak, Spencer built Umbrella into a global powerhouse through a combination of legitimate business, covert operations, and relentless pursuit of bioweapons research.");
            results.push(2000)
            results.push("Spencer's leadership was marked by secrecy, manipulation, and a willingness to sacrifice anything for the sake of progress. He orchestrated the company's rise to power while keeping his true intentions hidden behind layers of corporate structure and plausible deniability.");
            results.push(2000)
            results.push("Buyers should recognize Spencer as the architect of Umbrella's complex web of operations. His influence is still felt in the company's culture and practices, and understanding his role can provide insight into how Umbrella operates in the black market.");
            results.push(2000)
            results.push('<img src="assets/images/oswell.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
        break;

        case "Dr. Edward Ashford - Key Researcher":
            results.push(300)
            results.push("Dr. Edward Ashford was a key figure in Umbrella's early research and development efforts, particularly in the field of viral weaponry. He was instrumental in the creation of several viral strains and B.O.W.s, and his work had a lasting impact on the company's direction.");
            results.push(2000)
            results.push("Ashford's research was marked by a focus on genetic manipulation and viral enhancement, and he was known for his willingness to push ethical boundaries in pursuit of scientific breakthroughs. His contributions were significant, but his methods were often controversial.");
            results.push(2000)
            results.push("Buyers should view Ashford as a complex figure whose work contributed to both the advancement of bioweapons and the ethical dilemmas that continue to plague the industry. His legacy is a reminder of the fine line between innovation and recklessness in this field.");
            results.push(2000)
            results.push('<img src="assets/images/edward.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
        break;

        case "Dr. Alexander Ashford - Key Scientist":
            results.push(300)
            results.push("Dr. Alexander Ashford was a brilliant but unstable scientist who played a significant role in Umbrella's viral research. He was responsible for the creation of several B.O.W.s and viral strains, and his work was marked by a combination of genius and madness.");
            results.push(2000)
            results.push("Ashford's research was often driven by personal obsession and a desire for recognition, leading him to take dangerous risks and make ethically questionable decisions. His contributions were significant, but his legacy is also a cautionary tale of the dangers of unchecked ambition in bioweapons research.");
            results.push(2000)
            results.push("Buyers should view Ashford as a complex figure whose work had a profound impact on Umbrella's operations. His story serves as a reminder of the importance of ethical considerations in this line of work, and the potential consequences of pursuing scientific advancement without restraint.");
            results.push(2000)
            results.push('<img src="assets/images/alexander.png" style="max-width: 400px; margin: 10px 0;border: 2px solid #00ff9c">')
            results.push(300)
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